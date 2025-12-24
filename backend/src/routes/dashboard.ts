
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/summary', authenticateToken, (req, res) => {
    // Aggregation queries
    const openNCRs = db.prepare("SELECT COUNT(*) as count FROM ncrs WHERE status = 'Open'").get() as any;
    // const activeCAPAs = db.prepare("SELECT COUNT(*) as count FROM capas WHERE status = 'Active'").get() as any; // Capa table not yet created, mock 0 or add table
    const activeCAPAs = { count: 12 }; // Mock from seed equivalent or just 0
    // const openRisks = ...
    const pendingFAIs = db.prepare("SELECT COUNT(*) as count FROM fai_records WHERE status = 'Planned' OR status = 'In Progress'").get() as any;

    // COPQ Data: Sum of severity or just straight count of all historic NCRs/Scrap
    // For this formula: Total Scrap Count * ($500 + $200)
    // We'll count all NCRs as "Scrap" for the visual, or maybe a specific type
    const totalScrap = db.prepare("SELECT COUNT(*) as count FROM ncrs").get() as any;

    const stats = {
        openNCRs: openNCRs.count,
        activeCAPAs: activeCAPAs.count,
        openRisks: 8, // mocked
        pendingFAIs: pendingFAIs.count,
        totalScrap: totalScrap.count
    };

    const recentNCRs = db.prepare("SELECT * FROM ncrs ORDER BY date DESC LIMIT 5").all();
    const upcomingAudits = db.prepare("SELECT * FROM audits WHERE date >= ? ORDER BY date ASC LIMIT 5").all(new Date().toISOString().split('T')[0]);

    res.json({
        stats,
        recentNCRs,
        upcomingAudits,
        keyMetrics: [
            { label: 'On-Time Delivery', value: '94.5%', target: '95%', status: 'warning' },
            { label: 'First Pass Yield', value: '97.2%', target: '95%', status: 'good' },
            // dynamic machine metrics could be added here
        ]
    });
});

export default router;
