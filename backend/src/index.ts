
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const PORT = 3001;

import { initDb } from './db';
import { seedDatabase } from './db/seed';
import db from './db';

// Initialize DB
try {
    initDb();
    // Check if seeding is needed (if users table is empty)
    // We wrap in try-catch in case table doesn't exist yet (though initDb should create it)
    const row = db.prepare('SELECT count(*) as count FROM users').get() as any;
    if (row && row.count === 0) {
        console.log("Database empty, seeding...");
        seedDatabase();
    }
} catch (e) {
    console.error("Database init error:", e);
}

import authRoutes from './routes/auth';
import productionRoutes from './routes/production';
import workOrderRoutes from './routes/workOrders';
import faiRoutes from './routes/fai';
import dashboardRoutes from './routes/dashboard';
import ncrsRoutes from './routes/ncrs';
import simulationRoutes from './routes/simulation';
import traceabilityRoutes from './routes/traceability';

import projectRoutes from './routes/projects';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/production', productionRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use('/api/v1/fai', faiRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/ncrs', ncrsRoutes);
app.use('/api/v1/simulation', simulationRoutes);
app.use('/api/v1/traceability', traceabilityRoutes);
app.use('/api/v1/projects', projectRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handler
import { startSimulation } from './sim/engine';
startSimulation(wss);

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to BAKIRDEF LITE backend' }));
});

server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
