import db from './index';

const users = db.prepare('SELECT * FROM users').all();
console.log('Current Users:', users);

const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
console.log('Admin User:', admin);
