
// MOCK DATA SOURCES DERIVED FROM KAGGLE DATASETS
// 1. AI4I 2020 Predictive Maintenance Dataset
// 2. DataCo Smart Supply Chain
// 3. Manufacturing Defects

// --- PRESERVED FOR ANIMATION LOOP (Dashboard.tsx) ---
export const machineTelemetry = [
    { timestamp: 0, rpm: 1551, torque: 42.8, temp: 298.1, wear: 0, failure: 0 },
    { timestamp: 1, rpm: 1408, torque: 46.3, temp: 298.2, wear: 3, failure: 0 },
    { timestamp: 2, rpm: 1498, torque: 49.4, temp: 298.1, wear: 5, failure: 0 },
    { timestamp: 3, rpm: 1433, torque: 39.5, temp: 298.2, wear: 7, failure: 0 },
    { timestamp: 4, rpm: 1408, torque: 40.0, temp: 298.2, wear: 9, failure: 0 },
    { timestamp: 5, rpm: 1425, torque: 41.9, temp: 298.1, wear: 11, failure: 0 },
    { timestamp: 6, rpm: 1558, torque: 42.4, temp: 298.1, wear: 14, failure: 0 },
    { timestamp: 7, rpm: 1527, torque: 40.2, temp: 298.1, wear: 16, failure: 0 },
    { timestamp: 8, rpm: 1667, torque: 28.6, temp: 298.3, wear: 18, failure: 0 },
    { timestamp: 9, rpm: 1741, torque: 28.0, temp: 298.5, wear: 21, failure: 0 },
    { timestamp: 10, rpm: 1361, torque: 48.5, temp: 298.6, wear: 190, failure: 1 }, // Simulated Failure Spike
    { timestamp: 11, rpm: 1662, torque: 45.3, temp: 298.6, wear: 205, failure: 1 },
    { timestamp: 12, rpm: 1500, torque: 40.0, temp: 298.6, wear: 22, failure: 0 }, // Reset/Repair
    { timestamp: 13, rpm: 1515, torque: 41.3, temp: 298.2, wear: 24, failure: 0 },
    { timestamp: 14, rpm: 1600, torque: 38.0, temp: 298.5, wear: 26, failure: 0 },
    { timestamp: 15, rpm: 1450, torque: 45.0, temp: 298.7, wear: 29, failure: 0 },
    { timestamp: 16, rpm: 1480, torque: 43.1, temp: 298.8, wear: 31, failure: 0 },
    { timestamp: 17, rpm: 1510, torque: 42.5, temp: 298.9, wear: 33, failure: 0 },
    { timestamp: 18, rpm: 1530, torque: 41.8, temp: 299.1, wear: 36, failure: 0 },
    { timestamp: 19, rpm: 1545, torque: 40.9, temp: 299.2, wear: 40, failure: 0 },
];

// --- USER SPECIFIC MOCK DATA (Snapshot & Lists) ---

// 1. AI4I 2020 Predictive Maintenance Data (Digital Twin Snapshot)
export const machineLiveFeed = [
    { id: "CNC-001", type: "Milling", rpm: 1450, temp: 302.1, torque: 40.5, wear: 5, failure: 0, status: "Active" },
    { id: "CNC-002", type: "Turning", rpm: 1200, temp: 310.5, torque: 55.2, wear: 65, failure: 0, status: "Active" }, // Yüksek aşınma
    { id: "MILL-001", type: "Milling", rpm: 1100, temp: 298.0, torque: 35.5, wear: 120, failure: 0, status: "Active" }, // Heat Treat / Furnace
    { id: "CMM-001", type: "Measuring", rpm: 500, temp: 295.1, torque: 10.2, wear: 2, failure: 0, status: "Active" },
];

// 2. DataCo Smart Supply Chain Data (Smart Bidding)
export const supplyChainLog = [
    { id: "SC-1029", route: "Asia-Europe", scheduledDays: 12, realDays: 15, delayRisk: "High" },
    { id: "SC-1030", route: "Domestic", scheduledDays: 2, realDays: 2, delayRisk: "Low" },
    { id: "SC-1031", route: "US-Europe", scheduledDays: 8, realDays: 9, delayRisk: "Medium" },
];

// 3. Manufacturing Defects Data (NCR List)
export const defectQualityLog = [
    { id: "NCR-2025-001", type: "Dimension Mismatch", location: "CNC-001", severity: "Critical", date: "2025-12-07" },
    { id: "NCR-2025-002", type: "Surface Scratch", location: "Assembly Line", severity: "Minor", date: "2025-12-06" },
    { id: "NCR-2025-003", type: "Thermal Deformation", location: "Oven-02", severity: "Major", date: "2025-12-06" },
];
