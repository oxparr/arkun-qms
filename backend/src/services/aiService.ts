
import db from '../db';
import { randomFloat } from '../utils/rng';

export class AIService {

    /**
     * Simulates a Predictive Maintenance Model (e.g., Random Forest or LSTM).
     * 
     * In a real system, this would:
     * 1. Fetch historical sensor data (timeseries).
     * 2. Feed it into a Tensorflow/PyTorch model.
     * 3. Return the inference result.
     * 
     * Here, we simulate the inference logic based on 'Digital Twin' heuristics.
     * 
     * @param machine Current machine state
     * @returns { rul: number, pof: number } Calculated RUL (Hours) and PoF (%)
     */
    static predictMaintenance(machine: any): { rul: number, pof: number } {
        // 1. Fetch recent logs/history (Feature Engineering)
        const logs = db.prepare('SELECT * FROM machine_logs WHERE machine_id = ? ORDER BY timestamp DESC LIMIT 10').all(machine.id);

        // 2. Heuristic "Model"
        // Factors: Health Score (decay), Running Time, Recent Errors

        // Base RUL on Health Score (Linear Decay assumption for this demo model)
        // If Health is 100, RUL is max (e.g. 1000 hours). 
        // If Health is 20, RUL is near 0.
        let estimatedRUL = (machine.health_score / 100) * 1000;

        // Adjust based on "OEE" (Efficiency) - Lower efficiency might mean faster degradation
        if (machine.oee < 70) {
            estimatedRUL *= 0.8;
        }

        // Probability of Failure (PoF)
        // Inverse of Health, but exponential as it gets critical.
        let pof = 0;
        if (machine.health_score > 90) pof = randomFloat(0, 2);
        else if (machine.health_score > 70) pof = randomFloat(2, 10);
        else if (machine.health_score > 50) pof = randomFloat(10, 30);
        else if (machine.health_score > 30) pof = randomFloat(30, 60);
        else pof = randomFloat(60, 95); // Critical Zone

        // Status Adjustment
        if (machine.status === 'Error') {
            pof = 100;
            estimatedRUL = 0;
        }

        return {
            rul: parseFloat(estimatedRUL.toFixed(1)),
            pof: parseFloat(pof.toFixed(1))
        };
    }
}
