
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:workOrderId', authenticateToken, (req, res) => {
    const { workOrderId } = req.params;

    try {
        // 1. Get Core Work Order Data
        const wo = db.prepare(`
            SELECT wo.*, p.name as project_name, p.customer 
            FROM work_orders wo
            LEFT JOIN projects p ON wo.project_id = p.id
            WHERE wo.id = ?
        `).get(workOrderId) as any;

        if (!wo) {
            return res.status(404).json({ error: 'Work Order not found' });
        }

        // 2. Get Production Timeline (Logs)
        const timeline = db.prepare(`
            SELECT 
                pl.id, 
                pl.timestamp, 
                pl.action, 
                pl.details, 
                u.username as operator, 
                m.name as machine 
            FROM production_logs pl
            LEFT JOIN users u ON pl.operator_id = u.id
            LEFT JOIN machines m ON pl.machine_id = m.id
            WHERE pl.work_order_id = ?
            ORDER BY pl.timestamp ASC
        `).all(workOrderId) as any[];

        // 3. Get Associated NCRs
        const ncrs = db.prepare(`
            SELECT id, title, severity, status, date 
            FROM ncrs 
            WHERE work_order_id = ?
        `).all(workOrderId);

        // 4. Get FAI Status
        const fai = db.prepare(`
            SELECT status, inspection_date, inspector 
            FROM fai_records 
            WHERE part_number = ?
        `).get(wo.part_number);

        // 5. Calculate Metrics
        // (Simplified for demo)
        const startTime = timeline.length > 0 ? new Date(timeline[0].timestamp).getTime() : 0;
        const endTime = wo.end_time ? new Date(wo.end_time).getTime() : Date.now();
        const totalMachineTime = (startTime > 0) ? Math.floor((endTime - startTime) / 60000) : 0; // minutes

        const genealogy = {
            workOrder: wo,
            metadata: {
                totalMachineTimeMinutes: totalMachineTime,
                qualityStatus: ncrs.length > 0 ? 'Review Required' : (fai ? 'Verified' : 'Pending FAI'),
                faiStatus: fai || null
            },
            timeline: timeline.map((event: any) => ({
                ...event,
                type: 'production'
            })).concat(ncrs.map((ncr: any) => ({
                id: ncr.id,
                timestamp: ncr.date,
                action: 'NCR_CREATED',
                details: `${ncr.severity} NCR: ${ncr.title}`,
                operator: 'System/Quality',
                type: 'ncr'
            }))).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        };

        res.json(genealogy);

    } catch (e: any) {
        console.error("Traceability Error:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
