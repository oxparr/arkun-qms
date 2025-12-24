
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM fai_records');
    const records = stmt.all();
    res.json(records);
});

router.post('/', authenticateToken, (req, res) => {
    // Create new FAI
    const { id, partNumber, revision, description, status, inspectionDate, inspector, totalCharacteristics } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO fai_records (id, part_number, revision, description, status, inspection_date, inspector, total_characteristics, production_locked) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);
        stmt.run(id, partNumber, revision, description, status, inspectionDate, inspector, totalCharacteristics);
        res.status(201).json({ message: 'FAI Created', id });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

router.put('/:id', authenticateToken, (req, res) => {
    // Update FAI (e.g. approve)
    const { status, inspectionDate, inspector, nonConformances, inspectedCharacteristics } = req.body;
    const { id } = req.params;

    const locked = status === 'Approved' ? 0 : 1;

    const stmt = db.prepare(`
        UPDATE fai_records 
        SET status = ?, inspection_date = ?, inspector = ?, non_conformances = ?, inspected_characteristics = ?, production_locked = ?
        WHERE id = ?
    `);

    stmt.run(status, inspectionDate, inspector, nonConformances, inspectedCharacteristics, locked, id);
    res.json({ message: 'FAI Updated' });
});

export default router;
