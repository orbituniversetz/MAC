import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/tmp/garage.db' 
  : path.join(process.cwd(), 'garage.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    plateNumber TEXT NOT NULL UNIQUE,
    makeModel TEXT,
    FOREIGN KEY(customerId) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS jobsheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobNo TEXT NOT NULL UNIQUE,
    customerId INTEGER,
    vehicleId INTEGER,
    complaint TEXT,
    mechanicNotes TEXT,
    status TEXT DEFAULT 'Draft',
    openedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    closedAt DATETIME,
    FOREIGN KEY(customerId) REFERENCES customers(id),
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS job_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobSheetId INTEGER,
    proformaId INTEGER,
    type TEXT NOT NULL,
    description TEXT,
    qty REAL DEFAULT 1,
    unitPrice REAL DEFAULT 0,
    subtotal REAL DEFAULT 0,
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(proformaId) REFERENCES proformas(id)
  );

  CREATE TABLE IF NOT EXISTS proformas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proformaNo TEXT NOT NULL UNIQUE,
    jobSheetId INTEGER,
    customerId INTEGER,
    vehicleId INTEGER,
    status TEXT DEFAULT 'Draft',
    snapshotJson TEXT,
    discount REAL DEFAULT 0,
    taxEnabled INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(customerId) REFERENCES customers(id),
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceNo TEXT NOT NULL UNIQUE,
    jobSheetId INTEGER,
    proformaId INTEGER,
    status TEXT DEFAULT 'Unpaid',
    snapshotJson TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(proformaId) REFERENCES proformas(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceId INTEGER,
    amount REAL NOT NULL,
    method TEXT,
    reference TEXT,
    paidAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(invoiceId) REFERENCES invoices(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Migration safety for existing local databases
try { db.exec("ALTER TABLE proformas ADD COLUMN customerId INTEGER;"); } catch (e) {}
try { db.exec("ALTER TABLE proformas ADD COLUMN vehicleId INTEGER;"); } catch (e) {}

const customerCount = db.prepare('SELECT count(*) as count FROM customers').get() as { count: number };
if (customerCount.count === 0) {
  db.prepare('INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)').run('Baraka Joseph', '0712 000 000', 'Posta, Dar es Salaam');
  db.prepare('INSERT INTO vehicles (customerId, plateNumber, makeModel) VALUES (?, ?, ?)').run(1, 'T 123 ABC', 'Toyota Hilux');
  db.prepare('INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status) VALUES (?, ?, ?, ?, ?)').run('JS-0001', 1, 1, 'Oil change and brake check', 'Draft');
  db.prepare('INSERT INTO job_items (jobSheetId, type, description, qty, unitPrice, subtotal) VALUES (?, ?, ?, ?, ?, ?)').run(1, 'PART', 'Oil Filter', 1, 35000, 35000);
  db.prepare('INSERT INTO job_items (jobSheetId, type, description, qty, unitPrice, subtotal) VALUES (?, ?, ?, ?, ?, ?)').run(1, 'LABOUR', 'General Service', 1, 50000, 50000);
  
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('garage_name', 'M. A. C. GARAGE');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('garage_mailbox', 'P.O. Box 7005, Arusha');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('garage_address', 'Arusha, Tanzania');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('garage_phone', '(+255) 754-349749');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('garage_tin', '108-133-805');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('bank_name', 'CRDB');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('bank_branch', 'TFA');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('bank_account_name', 'M. A. C. GARAGE');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('bank_account_number', '0150457890500');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('bank_swift', 'CORUTZTZ');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('tax_rate', '18');
}

export default db;