import { Request, Response, NextFunction } from 'express';
import db from '../db';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export function checkMachineInterlocks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const machineId = req.body.machineId; // Assuming machineId is passed in body for start
    // If param has machineId, use it. Or if it's work order based, resolve machine.
    // For now, let's assume the route passes machineId or we look it up.
    // Actually, workOrders.ts /:id/start uses workOrderId.

    const workOrderId = req.params.id; // from /work-orders/:id/start route

    if (!workOrderId) {
        // If not a WO route, maybe skip or require machineId
        return next();
    }

    try {
        const wo = db.prepare('SELECT * FROM work_orders WHERE id = ?').get(workOrderId) as any;
        if (!wo) return res.status(404).json({ error: "Work Request not found" });

        // 1. FAI Interlock
        const fai = db.prepare('SELECT * FROM fai_records WHERE part_number = ?').get(wo.part_number) as any;
        if (fai && fai.production_locked && fai.status !== 'Approved') {
            return res.status(403).json({
                error: 'Interlock: FAI Locked',
                details: 'Quality Approval Required for First Article.',
                code: 'FAI_LOCK'
            });
        }

        // 2. Machine & Tool Life Interlock
        // We need to know which machine is being started. Use query param or body.
        const targetMachineId = req.body.machineId;
        if (targetMachineId) {
            const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(targetMachineId) as any;
            if (machine && machine.connected_tool_id) {
                const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(machine.connected_tool_id) as any;
                if (tool && tool.life_remaining < 5) {
                    return res.status(403).json({
                        error: 'Interlock: Tool Life Expired',
                        details: `Tool ${tool.name} has < 5% life remaining. Replace tool.`,
                        code: 'TOOL_LIFE'
                    });
                }
            }
        }

        // 3. Operator Competency Interlock
        const userId = req.user?.id;
        if (userId) {
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
            // Require Level 3 for running machines
            if (user && user.competency_level < 3) {
                return res.status(403).json({
                    error: 'Interlock: Competency Check Failed',
                    details: 'Operator skill level insufficient for this operation.',
                    code: 'SKILL_CHECK'
                });
            }
        }

        next();
    } catch (e: any) {
        console.error("Interlock Error:", e);
        res.status(500).json({ error: "Internal Interlock Error" });
    }
}
