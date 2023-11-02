import sqlite3 from 'sqlite3';
import { env } from '../env';


const filepath = `${env.DB_NAME}`;

export function createDBConnection(): sqlite3.Database {
    const db = new sqlite3.Database(filepath, (err) => {
        if (err) {
            console.log(err);
        } else {
            createTable(db);
        }
    });

    console.log('Connected to the database.');

    return db;
}

export async function createTable(db: sqlite3.Database) {
    db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL
    )`);
};
