
import db from '../db';

export class ProductionService {
    /**
     * Validates if a production run can start based on AS9100 Zero-Error rules.
     * Checks:
     * 1. FAI Lock (First Article Inspection)
     * 2. Operator Competency vs Machine Requirement
     * 
     * @param machineId ID of the machine
     * @param userId ID of the operator
     * @param partNumber Part number being produced
     * @throws Error if validation fails
     */
    static validateProductionStart(machineId: string, userId: string, partNumber: string, quantity: number = 1): void {
        // 1. Check FAI Lock
        // In AS9100, if FAI is not approved (or specifically locked), production cannot proceed.
        const fai = db.prepare('SELECT production_locked, status FROM fai_records WHERE part_number = ?').get(partNumber) as any;

        if (fai && fai.production_locked) {
            throw new Error(`CRITICAL: Production Locked for Part ${partNumber}. FAI Status: ${fai.status}. Contact Quality Manager.`);
        }

        // 2. Skill Enforcement (Competency Check)
        const machine = db.prepare('SELECT min_competency_level FROM machines WHERE id = ?').get(machineId) as any;
        const user = db.prepare('SELECT competency_level FROM users WHERE id = ?').get(userId) as any;

        if (machine && user) {
            const requiredLevel = machine.min_competency_level || 0;
            const userLevel = user.competency_level || 0;

            if (userLevel < requiredLevel) {
                throw new Error(`ACCESS DENIED: Operator Competency (${userLevel}) does not meet Machine Requirement (${requiredLevel}).`);
            }
        } else {
            // If machine or user not found, strict safe-fail
            if (!machine) throw new Error('Machine not found.');
            if (!user) throw new Error('User not found.');
        }

        // 3. BOM & Inventory Check
        const bomItems = db.prepare('SELECT child_part_number, quantity_required FROM bom_structures WHERE parent_part_number = ?').all(partNumber) as any[];

        for (const item of bomItems) {
            const requiredQty = item.quantity_required * quantity;
            const inventoryItem = db.prepare('SELECT quantity FROM inventory WHERE part_number = ?').get(item.child_part_number) as any;

            if (!inventoryItem || inventoryItem.quantity < requiredQty) {
                throw new Error(`INVENTORY SHORTAGE: Not enough stock for ${item.child_part_number}. Required: ${requiredQty}, Available: ${inventoryItem?.quantity || 0}`);
            }
        }


        // Logic passed
    }
}
