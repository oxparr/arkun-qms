
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';
import { checkMachineInterlocks } from '../middleware/interlock';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM work_orders');
    const workOrders = stmt.all();
    res.json(workOrders);
});

router.get('/:id', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM work_orders WHERE id = ?');
    const wo = stmt.get(req.params.id);
    if (!wo) return res.status(404).json({ error: 'Work Order not found' });
    res.json(wo);
});

import { ProductionService } from '../services/productionService';

// ...

router.post('/:id/start', authenticateToken, checkMachineInterlocks, (req, res) => {
    const { id } = req.params;
    const { machineId } = req.body;
    const userId = (req as any).user.id;

    try {
        // Fetch WO to get Part Number and Quantity
        const wo = db.prepare('SELECT part_number, quantity FROM work_orders WHERE id = ?').get(id) as any;
        if (!wo) return res.status(404).json({ error: 'Work Order not found' });

        // Zero-Error Validation
        if (machineId) {
            ProductionService.validateProductionStart(machineId, userId, wo.part_number, wo.quantity);
        }

        // Proceed
        const stmt = db.prepare('UPDATE work_orders SET status = ?, start_time = ? WHERE id = ?');
        stmt.run('In Progress', new Date().toISOString(), id);

        // Update Machine and Log
        if (machineId) {
            db.prepare('UPDATE machines SET status = ? WHERE id = ?').run('Running', machineId);

            db.prepare(`
                INSERT INTO production_logs (work_order_id, machine_id, operator_id, action, details)
                VALUES (?, ?, ?, 'START', 'Operator started production run')
            `).run(id, machineId, userId);
        }

        res.json({ message: 'Work order started', id });

    } catch (e: any) {
        // Catch Zero-Error Validation Exceptions
        console.error("Production Start Blocked:", e.message);
        return res.status(400).json({ error: e.message });
    }
});

router.post('/:id/complete', authenticateToken, (req, res) => {
    const stmt = db.prepare('UPDATE work_orders SET status = ?, end_time = ? WHERE id = ?');
    stmt.run('Completed', new Date().toISOString(), req.params.id);
    res.json({ message: 'Work order completed' });
});

export default router;
