
import db from './index';
import { setSeed, randomInt, sample, randomFloat } from '../utils/rng';

export function seedDatabase() {
    setSeed(42); // Ensure deterministic seeding

    // 1. Tools
    const tools = ['Drill-001', 'Mill-002', 'Lathe-Tool-A', 'Probe-X'];
    const stmtTool = db.prepare('INSERT OR REPLACE INTO tools (id, name, life_remaining, status) VALUES (?, ?, ?, ?)');
    tools.forEach(id => {
        stmtTool.run(id, id, 95, 'Ready');
    });

    // 2. Machines
    const machines = [
        { id: 'CNC-001', name: 'CNC Milling Center', type: 'Milling', minSkill: 3 },
        { id: 'CNC-002', name: '5-Axis CNC', type: 'Milling', minSkill: 5 },
        { id: 'CNC-003', name: 'Lathe Station', type: 'Lathe', minSkill: 2 },
        { id: 'FURNACE-001', name: 'Heat Treat Furnace', type: 'Furnace', minSkill: 4 },
        { id: 'FURNACE-002', name: 'Vacuum Furnace', type: 'Furnace', minSkill: 4 },
        { id: 'CMM-001', name: 'CMM Inspection', type: 'Inspection', minSkill: 2 }
    ];

    const stmtMachine = db.prepare('INSERT OR REPLACE INTO machines (id, name, status, health_score, oee, connected_tool_id, min_competency_level, predicted_rul, failure_probability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    machines.forEach((m, idx) => {
        const toolId = idx === 0 ? 'Drill-001' : null;
        stmtMachine.run(m.id, m.name, 'Idle', 100, 0, toolId, m.minSkill, 0, 0);
    });
    console.log('Seeded 6 machines with skill requirements');

    // 3. Inventory & GFE (Shadow Inventory)
    const inventory = [
        { pn: 'RAW-AL-7075-T6', desc: 'Aluminum 7075 Plate 10mm', qty: 500, gfe: 0, owner: null },
        { pn: 'RAW-TI-6AL4V', desc: 'Titanium Round Bar 50mm', qty: 200, gfe: 0, owner: null },
        { pn: 'SENSOR-AS-99', desc: 'Adv. Optical Sensor (Consignment)', qty: 15, gfe: 1, owner: 'ASELSAN' },
        { pn: 'FAST-LOCK-01', desc: 'Locking Nut M10 (Gov. Issue)', qty: 5000, gfe: 1, owner: 'SSB' },
        { pn: 'SUB-PCBA-01', desc: 'Control Board V2', qty: 50, gfe: 0, owner: null }
    ];
    const stmtInventory = db.prepare('INSERT OR REPLACE INTO inventory (id, part_number, description, quantity, is_gfe, owner) VALUES (?, ?, ?, ?, ?, ?)');
    inventory.forEach((item, idx) => {
        stmtInventory.run(`INV-${idx + 1}`, item.pn, item.desc, item.qty, item.gfe, item.owner);
    });
    console.log('Seeded Inventory & GFE');

    // 4. Projects (EVM)
    const projects = [
        { id: 'PRJ-001', name: 'Altay Tank Modernization', code: 'ATM-2025', budget: 1200000, status: 'Active' },
        { id: 'PRJ-002', name: 'F-16 Structural Upgrade', code: 'F16-UPG', budget: 850000, status: 'Active' },
        { id: 'PRJ-003', name: 'UAV Optics R&D', code: 'UAV-OPT-X', budget: 300000, status: 'On Hold' }
    ];
    const stmtProject = db.prepare('INSERT OR REPLACE INTO projects (id, name, code, budget, status) VALUES (?, ?, ?, ?, ?)');
    projects.forEach(p => {
        stmtProject.run(p.id, p.name, p.code, p.budget, p.status);
    });
    console.log('Seeded Projects');

    // 5. BOM Structures
    // Parent PNs will be used in WOs
    const boms = [
        { parent: 'PN-TANK-ARMOR-01', child: 'RAW-TI-6AL4V', qty: 2 },
        { parent: 'PN-TANK-ARMOR-01', child: 'FAST-LOCK-01', qty: 12 },
        { parent: 'PN-UAV-LENS-MT', child: 'RAW-AL-7075-T6', qty: 1 },
        { parent: 'PN-UAV-LENS-MT', child: 'SENSOR-AS-99', qty: 1 }, // GFE Dependency
    ];
    const stmtBOM = db.prepare('INSERT OR REPLACE INTO bom_structures (parent_part_number, child_part_number, quantity_required) VALUES (?, ?, ?)');
    boms.forEach(b => {
        stmtBOM.run(b.parent, b.child, b.qty);
    });
    console.log('Seeded BOMs');

    // Create 10 users + 1 Admin
    const stmtUser = db.prepare('INSERT OR REPLACE INTO users (id, username, role, password_hash, competency_level) VALUES (?, ?, ?, ?, ?)');

    // Admin User
    stmtUser.run('USER-ADMIN', 'admin', 'admin', 'admin123', 5);
    console.log('Seeded Admin user');

    for (let i = 1; i <= 10; i++) {
        const role = i === 1 ? 'manager' : (i <= 4 ? 'quality' : 'operator');
        // Operator competency varies for testing
        // User 5 is Novice (Level 1)
        // User 6 is Expert (Level 5)
        // Others mid-level
        const competency = i === 5 ? 1 : (i === 6 ? 5 : 3);
        stmtUser.run(`USER-${i}`, `user${i}`, role, 'hash_placeholder', competency);
    }
    console.log('Seeded 10 standard users');

    // 6. Work Orders
    const stmtWorkOrder = db.prepare('INSERT OR REPLACE INTO work_orders (id, part_number, quantity, status, priority, project_id) VALUES (?, ?, ?, ?, ?, ?)');

    // WO 1: Matches Tank Project, Valid BOM
    stmtWorkOrder.run('WO-2025-001', 'PN-TANK-ARMOR-01', 10, 'Pending', 'High', 'PRJ-001');

    // WO 2: Matches UAV Project, Requires GFE
    stmtWorkOrder.run('WO-2025-002', 'PN-UAV-LENS-MT', 5, 'Pending', 'Normal', 'PRJ-003');

    // WO 3: Generic
    stmtWorkOrder.run('WO-2025-003', 'PN-GENERIC-Bracket', 50, 'In Progress', 'Low', 'PRJ-002');

    console.log('Seeded Work Orders linked to Projects');

    // 7. FAI Records
    const stmtFAI = db.prepare('INSERT OR REPLACE INTO fai_records (id, part_number, revision, description, status, inspection_date, inspector, production_locked, non_conformances, total_characteristics, inspected_characteristics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    // Zero-Error Scenario:
    // PN-TANK-ARMOR-01 -> Approved (Can produce)
    // PN-UAV-LENS-MT -> Rejected/Locked (Should Block Production)

    stmtFAI.run('FAI-001', 'PN-TANK-ARMOR-01', 'A', 'Main Armor Plate', 'Approved', '2025-01-10', 'Quality Lead', 0, 0, 100, 100);
    stmtFAI.run('FAI-002', 'PN-UAV-LENS-MT', 'B', 'Lens Mount Assy', 'Rejected', '2025-01-12', 'Quality Lead', 1, 5, 50, 50); // Locked

    console.log('Seeded FAI Records (Locked/Unlocked)');

    // 8. NCRs
    const stmtNCR = db.prepare('INSERT OR REPLACE INTO ncrs (id, title, severity, status, date, type, machine_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmtNCR.run('NCR-2025-001', 'Spindle Vibration Excess', 'Major', 'Open', '2025-12-04', 'Machine', 'CNC-001');
    console.log('Seeded NCRs');

    console.log('Database seeding complete.');
}
