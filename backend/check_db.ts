import db from './src/db';

try {
    const info = db.prepare("PRAGMA table_info(users)").all();
    console.log("Users Table Columns:", info);
} catch (e) {
    console.error(e);
}
