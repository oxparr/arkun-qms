
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/machines', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM machines');
    const machines = stmt.all();
    res.json(machines);
});

router.get('/machines/:id', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM machines WHERE id = ?');
    const machine = stmt.get(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json(machine);
});

// Run simulation manually (for testing)
router.post('/machines/run-sim', authenticateToken, (req, res) => {
    // This would trigger the sim engine for one tick
    // We will implement the actual sim engine logic later
    res.json({ message: 'Simulation step triggered' });
});

router.post('/start-batch', authenticateToken, (req, res) => {
    // Mock implementation for FAI start batch
    const { id, machineId } = req.body;
    console.log(`Starting batch for FAI ${id} on machine ${machineId}`);
    res.json({ message: 'Batch production started', batchId: `BATCH-${Date.now()}` });
});

router.get('/traceability/search', authenticateToken, (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query required" });

    const sql = `
        SELECT 
            pl.id, 
            pl.timestamp, 
            pl.action, 
            pl.details,
            m.name as machine_name,
            u.username as operator_name,
            wo.part_number,
            wo.id as work_order_id
        FROM production_logs pl
        LEFT JOIN machines m ON pl.machine_id = m.id
        LEFT JOIN users u ON pl.operator_id = u.id
        LEFT JOIN work_orders wo ON pl.work_order_id = wo.id
        WHERE wo.id LIKE ? OR wo.part_number LIKE ?
        ORDER BY pl.timestamp DESC
    `;

    const logs = db.prepare(sql).all(`%${query}%`, `%${query}%`);
    res.json(logs);
});

export default router;
