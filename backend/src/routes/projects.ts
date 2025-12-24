
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();
    res.json(projects);
});

router.get('/:id/evm', authenticateToken, (req, res) => {
    const { id } = req.params;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // 1. Planned Value (PV) = Total Budget
    const PV = project.budget || 100000;

    // 2. Earned Value (EV)
    // Formula: Budget * % of Production Completed
    // We calculate % based on (Completed Work Orders / Total Work Orders)
    // Or better: (Completed Quantity / Total Quantity)
    const woStats = db.prepare(`
        SELECT 
            SUM(quantity) as total_qty,
            SUM(CASE WHEN status = 'Completed' THEN quantity ELSE 0 END) as completed_qty
        FROM work_orders 
        WHERE project_id = ?
    `).get(id) as any;

    const totalQty = woStats.total_qty || 1; // avoid div by 0
    const completedQty = woStats.completed_qty || 0;
    const progress = completedQty / totalQty;

    const EV = PV * progress;

    // 3. Actual Cost (AC)
    // Calculated from machine logs duration. 
    // Assumption: Machine cost = $150/hr
    const logs = db.prepare(`
        SELECT pl.timestamp, pl.action 
        FROM production_logs pl
        JOIN work_orders wo ON pl.work_order_id = wo.id
        WHERE wo.project_id = ?
        ORDER BY pl.timestamp ASC
    `).all(id) as any[];

    // Simple estimation: 1 log = 1 hour of work for this demo, 
    // or realistically we'd pair START/STOP. 
    // For robust demo math, let's assume each 'Completed' WO took 2 hours * qty/10?
    // Let's use a mock mapping or just simple math based on completed items for now to ensure we have data.
    // Better: AC = EV * (Random Factor for demo variance) unless we have real time logs.
    // Let's try to derive it from logs count to be "real".
    const logCount = logs.length;
    const estimatedHours = logCount * 0.5; // 30 mins per interaction
    const AC = estimatedHours * 150; // $150/hr labor+machine rate

    // Metrics
    const CPI = AC > 0 ? (EV / AC) : 1; // Cost Performance Index ( >1 Good )
    const SPI = (EV / (PV * (Date.now() - new Date(project.start_date || Date.now()).getTime()) / (30 * 24 * 3600 * 1000)));
    // SPI is tricky without a strict schedule timeline. 
    // Simplified SPI: EV / (PV * ExpectedProgress) where Expected is e.g. 50%.
    // for demo: 
    const SPI_Demo = EV / (PV * 0.5); // Assume we 'should' be 50% done by now

    res.json({
        projectId: id,
        metrics: {
            plannedValue: PV,
            earnedValue: EV,
            actualCost: AC,
            cpi: parseFloat(CPI.toFixed(2)),
            spi: parseFloat(SPI_Demo.toFixed(2)),
            progress: parseFloat((progress * 100).toFixed(1))
        },
        wbs: db.prepare('SELECT * FROM work_orders WHERE project_id = ?').all(id)
    });
});

export default router;
