
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;

export function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS machines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT CHECK(status IN ('Idle', 'Running', 'Error', 'Maintenance')) DEFAULT 'Idle',
      health_score INTEGER DEFAULT 100,
      oee INTEGER DEFAULT 0,
      maintenance_interval INTEGER DEFAULT 600,
      last_maintenance TEXT,
      total_run_time INTEGER DEFAULT 0,
      connected_tool_id TEXT,
      min_competency_level INTEGER DEFAULT 1, -- Zero-Error: Skill Enforcement
      predicted_rul REAL DEFAULT 0, -- AI: Remaining Useful Life (Hours)
      failure_probability REAL DEFAULT 0 -- AI: Probability of Failure (0-100%)
    );

    CREATE TABLE IF NOT EXISTS projects ( -- WBS Structure
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      customer TEXT,
      start_date TEXT,
      status TEXT DEFAULT 'Active',
      budget REAL DEFAULT 100000 -- EVM Planned Value base
    );

    CREATE TABLE IF NOT EXISTS bom_structures ( -- Bill of Materials
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_part_number TEXT NOT NULL,
      child_part_number TEXT NOT NULL,
      quantity_required INTEGER DEFAULT 1,
      FOREIGN KEY(child_part_number) REFERENCES inventory(part_number)
    );

    CREATE TABLE IF NOT EXISTS inventory ( -- Shadow Inventory (GFE)
      id TEXT PRIMARY KEY,
      part_number TEXT UNIQUE NOT NULL,
      description TEXT,
      quantity INTEGER DEFAULT 0,
      location TEXT,
      is_gfe BOOLEAN DEFAULT 0, -- Critical for AS9100 Shadow Inventory
      owner TEXT -- If GFE, specify owner
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      part_number TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT CHECK(status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
      start_time TEXT,
      end_time TEXT,
      priority TEXT DEFAULT 'Normal',
      project_id TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
    
    CREATE TABLE IF NOT EXISTS fai_records (
      id TEXT PRIMARY KEY,
      part_number TEXT NOT NULL,
      revision TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('Planned', 'In Progress', 'Completed', 'Approved', 'Rejected')) DEFAULT 'Planned',
      inspection_date TEXT,
      inspector TEXT,
      production_locked BOOLEAN DEFAULT 1, -- Zero-Error Lock
      non_conformances INTEGER DEFAULT 0,
      total_characteristics INTEGER DEFAULT 0,
      inspected_characteristics INTEGER DEFAULT 0,
      data TEXT
    );
    
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        role TEXT CHECK(role IN ('operator', 'quality', 'manager', 'admin')) NOT NULL,
        password_hash TEXT NOT NULL,
        competency_level INTEGER DEFAULT 3
    );

    CREATE TABLE IF NOT EXISTS ncrs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        severity TEXT CHECK(severity IN ('Minor', 'Major', 'Critical')) NOT NULL,
        status TEXT CHECK(status IN ('Open', 'In Progress', 'Contained', 'Closed')) DEFAULT 'Open',
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        work_order_id TEXT, -- Traceability
        machine_id TEXT,    -- Traceability
        FOREIGN KEY(work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY(machine_id) REFERENCES machines(id)
    );

    CREATE TABLE IF NOT EXISTS audits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        auditor TEXT,
        type TEXT
    );
    
    CREATE TABLE IF NOT EXISTS machine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_id TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        event_type TEXT,
        details TEXT,
        FOREIGN KEY(machine_id) REFERENCES machines(id)
    );
    
    CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_id TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        metric TEXT NOT NULL,
        value REAL NOT NULL,
        FOREIGN KEY(machine_id) REFERENCES machines(id)
    );

    CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        life_remaining INTEGER DEFAULT 100,
        status TEXT CHECK(status IN ('Ready', 'In Use', 'Expired', 'Maintenance')) DEFAULT 'Ready'
    );

    CREATE TABLE IF NOT EXISTS production_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_id TEXT,
        machine_id TEXT,
        operator_id TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        action TEXT,
        details TEXT,
        FOREIGN KEY(work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY(machine_id) REFERENCES machines(id),
        FOREIGN KEY(operator_id) REFERENCES users(id)
    );
  `;

  db.exec(schema);
  console.log('Database schema initialized with AS9100 enhancements.');
}
