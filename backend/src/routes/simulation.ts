import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';
import { randomInt, sample } from '../utils/rng';

const router = express.Router();

// Manager only middleware
const requireManager = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'manager') {
        return res.status(403).json({ error: 'Manager access required' });
    }
    next();
};

router.post('/force-breakdown', authenticateToken, requireManager, (req, res) => {
    // Force CNC-001 to Error
    const stmt = db.prepare('UPDATE machines SET status = ?, health_score = ? WHERE id = ?');
    stmt.run('Error', 20, 'CNC-001');
    res.json({ message: 'CNC-001 Forced to Breakdown (Health: 20%)' });
});

router.post('/expire-tool', authenticateToken, requireManager, (req, res) => {
    // Expire a tool
    const toolId = 'Drill-001';
    const stmt = db.prepare('UPDATE tools SET life_remaining = ?, status = ? WHERE id = ?');
    stmt.run(0, 'Expired', toolId);

    // Also update connected machine to ensure interlock triggers if it checks machine state
    // But interlock checks tool table directly, so this is enough.
    res.json({ message: `Tool ${toolId} life set to 0%` });
});

router.post('/inject-ncr', authenticateToken, requireManager, (req, res) => {
    // Create random NCRs
    const count = 5;
    const stmt = db.prepare('INSERT INTO ncrs (id, title, severity, status, date, type) VALUES (?, ?, ?, ?, ?, ?)');

    for (let i = 0; i < count; i++) {
        const id = `NCR-SIM-${Date.now()}-${i}`;
        const severity = sample(['Critical', 'Major']);
        stmt.run(id, 'Simulated Quality Spike', severity, 'Open', new Date().toISOString(), 'Simulation');
    }

    res.json({ message: `${count} NCRs injected` });
});

export default router;
