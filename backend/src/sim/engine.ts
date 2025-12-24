
import { WebSocketServer } from 'ws';
import db from '../db';
import { AIService } from '../services/aiService';
import { randomFloat, chance, sample, randomInt } from '../utils/rng';

export function startSimulation(wss: WebSocketServer) {
    console.log('Simulation Engine Started');

    setInterval(() => {
        tick(wss);
    }, 5000); // 5 second tick
}

function tick(wss: WebSocketServer) {
    // 1. Update Machines
    const machines = db.prepare('SELECT * FROM machines').all() as any[];
    let changesMade = false;

    machines.forEach(machine => {
        let newStatus = machine.status;
        let newHealth = machine.health_score;
        let newOee = machine.oee;

        // --- Logic: Running State ---
        if (machine.status === 'Running') {
            // Predictive Maintenance: Degrade health faster when running
            // Was 0.1-1.0, now 0.5-1.5 to simulate wear
            if (chance(0.3)) {
                newHealth -= randomFloat(0.5, 1.5);
            }

            // Forced Maintenance logic (Predictive)
            if (newHealth < 20) {
                newStatus = 'Maintenance';
                // Log event?
            }

            // Random Anomaly (Error)
            else if (chance(0.005)) { // 0.5% chance per tick
                newStatus = 'Error';
            }
            // Cycle Finished
            else if (chance(0.01)) {
                newStatus = 'Idle';
            }

            // OEE Pings
            newOee = Math.min(100, Math.max(50, newOee + randomFloat(-1, 1)));

        }
        // --- Logic: Idle State (Auto-Start Attempts) ---
        else if (machine.status === 'Idle') {
            // Simulation Auto-Start (Demo Level Liveness)
            if (chance(0.05)) {
                // ZERO-ERROR CHECK:
                // 1. Find a candidate part/Job (Mock: pick a random pending work order or part)
                // For sim purposes, we'll check a generic part to see if 'Production Locked'
                // Realistically, we'd pick a WO from the queue.

                // Let's grab a random part from FAI records to simulate a job attemp
                const part = db.prepare('SELECT part_number, production_locked FROM fai_records ORDER BY RANDOM() LIMIT 1').get() as any;

                let canStart = true;

                // FAI Lock Check
                if (part && part.production_locked === 1) {
                    canStart = false; // Validation Failed
                }

                // Operator Competency Check (Simulated)
                // Assume the "Simulated Operator" has level 3. 
                const simOperatorLevel = 3;
                if (machine.min_competency_level && simOperatorLevel < machine.min_competency_level) {
                    canStart = false;
                }

                if (canStart) {
                    newStatus = 'Running';
                }
            }
        }

        // --- State Transition Handling ---

        // AI: Calculate Prediction
        const prediction = AIService.predictMaintenance({ ...machine, health_score: newHealth, status: newStatus, oee: newOee });

        if (newStatus !== machine.status || newHealth !== machine.health_score || newOee !== machine.oee || prediction.pof !== machine.failure_probability) {

            // ANOMALY SIMULATION: If transitioning to Error, create NCR
            if (newStatus === 'Error' && machine.status !== 'Error') {
                const ncrId = `NCR-AUTO-${Date.now()}-${randomInt(100, 999)}`;
                // Try to link to a WO if we can find one, otherwise Generic
                db.prepare(`
                    INSERT INTO ncrs (id, title, severity, status, date, type, description, machine_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    ncrId,
                    `Automated Fault: ${machine.name}`,
                    'Major',
                    'Open',
                    new Date().toISOString(),
                    'Machine Error',
                    `Health fell to ${newHealth.toFixed(1)}%. Automatic detection.`,
                    machine.id
                );
            }

            // PROACTIVE MAINTENANCE ALERT (AI Trigger)
            if (prediction.pof > 85 && machine.status === 'Running' && newStatus !== 'Maintenance') {
                // Trigger logic (e.g. could force maintenance or just log)
            }

            db.prepare('UPDATE machines SET status = ?, health_score = ?, oee = ?, predicted_rul = ?, failure_probability = ? WHERE id = ?')
                .run(newStatus, newHealth, newOee, prediction.rul, prediction.pof, machine.id);
            changesMade = true;
        }
    });

    // 2. Broadcast Full State if Changed
    if (changesMade) {
        const allMachines = db.prepare('SELECT * FROM machines').all();
        broadcast(wss, {
            type: 'machine_update',
            machines: allMachines
        });
    }
}

function broadcast(wss: WebSocketServer, data: any) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
            client.send(msg);
        }
    });
}
