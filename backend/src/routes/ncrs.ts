
import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM ncrs');
    const ncrs = stmt.all();
    res.json(ncrs);
});

router.post('/', authenticateToken, (req, res) => {
    const { id, title, severity, status, date, type, description } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO ncrs (id, title, severity, status, date, type, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.run(id, title, severity, status, date, type, description);
        res.status(201).json({ message: 'NCR Created', id });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

export default router;
