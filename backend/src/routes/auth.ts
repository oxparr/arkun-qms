
import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { randomInt } from '../utils/rng';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bakirdef_secret_key_42';

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for:", username);

        // Simple query, in real world we hash passwords
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username) as any;

        if (!user) { // || !bcrypt.compareSync(password, user.password_hash)
            console.log("User not found or credentials invalid");
            // For demo purposes, we accept any password if user exists, or specific deterministic rule
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, competency_level: user.competency_level },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role, competency_level: user.competency_level } });
    } catch (e: any) {
        console.error("Login Error:", e);
        res.status(500).json({ error: e.message });
    }
});

router.get('/me', (req, res) => {
    // Check token logic normally handled by middleware, this is a quick check route
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        res.json({ user });
    } catch (e) {
        res.status(403).json({ error: 'Invalid token' });
    }
});

export default router;
