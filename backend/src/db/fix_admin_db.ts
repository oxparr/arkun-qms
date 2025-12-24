import db, { initDb } from './index';

try {
    console.log("Dropping users table...");
    db.exec('DROP TABLE IF EXISTS users');

    console.log("Re-initializing DB schema...");
    initDb();

    console.log("Inserting Admin User...");
    const stmtUser = db.prepare('INSERT INTO users (id, username, role, password_hash, competency_level) VALUES (?, ?, ?, ?, ?)');
    stmtUser.run('USER-ADMIN', 'admin', 'admin', 'admin123', 5);

    console.log("Inserting Standard Users...");
    for (let i = 1; i <= 5; i++) {
        const role = i === 1 ? 'manager' : (i <= 3 ? 'quality' : 'operator');
        stmtUser.run(`USER-${i}`, `user${i}`, role, 'hash_placeholder', 3);
    }

    console.log("Success! Admin user created.");
} catch (e) {
    console.error("Error fixing DB:", e);
}
