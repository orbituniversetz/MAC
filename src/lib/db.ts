import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Detect environment
const isElectron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
const dbName = 'garage.db';

let dbPath: string;

if (isElectron) {
  // Production (Electron EXE)
  const dataDir = path.join(os.homedir(), '.garageflow_desk');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.error('Failed to create data directory');
    }
  }
  dbPath = path.join(dataDir, dbName);
} else {
  // Local Web / Development
  // We use a dedicated folder in the project root to ensure it's not deleted by Next.js builds
  const localDataDir = path.join(process.cwd(), 'local_data');
  if (!fs.existsSync(localDataDir)) {
    try {
      fs.mkdirSync(localDataDir, { recursive: true });
    } catch (e) {}
  }
  dbPath = path.join(localDataDir, dbName);
}

// Ensure database path is absolute and directory exists
const finalDbPath = path.resolve(dbPath);
const dbDir = path.dirname(finalDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(finalDbPath);

// Performance Optimizations for SQLite
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('temp_store = MEMORY');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    tin TEXT
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
    taxEnabled INTEGER DEFAULT 1,
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
    customerId INTEGER,
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(proformaId) REFERENCES proformas(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceId INTEGER,
    proformaId INTEGER,
    amount REAL NOT NULL,
    method TEXT,
    reference TEXT,
    paidAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(invoiceId) REFERENCES invoices(id),
    FOREIGN KEY(proformaId) REFERENCES proformas(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobSheetId INTEGER,
    proformaId INTEGER,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT DEFAULT 'OTHER',
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(proformaId) REFERENCES proformas(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    docType TEXT NOT NULL,
    docNo TEXT UNIQUE,
    customerId INTEGER,
    jobSheetId INTEGER,
    title TEXT,
    content TEXT,
    status TEXT DEFAULT 'Draft',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customerId) REFERENCES customers(id),
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id)
  );

  CREATE INDEX IF NOT EXISTS idx_vehicles_cust ON vehicles(customerId);
  CREATE INDEX IF NOT EXISTS idx_jobsheets_cust ON jobsheets(customerId);
  CREATE INDEX IF NOT EXISTS idx_items_js ON job_items(jobSheetId);
`);

// Seed initial settings if empty
const settingsCount = db.prepare('SELECT count(*) as count FROM settings').get() as any;
if (settingsCount.count === 0) {
  const defaultSettings = [
    ['garage_name', 'M. A. C. GARAGE'],
    ['garage_mailbox', 'P.O. Box 7005, Arusha'],
    ['garage_address', 'Arusha, Tanzania'],
    ['garage_phone', '+255 754-349749'],
    ['garage_tin', '108-133-805'],
    ['tax_rate', '18'],
    ['bank_name', 'CRDB'],
    ['bank_account_name', 'M. A. C. GARAGE'],
    ['bank_account_number', '0150457890500'],
    ['bank_swift', 'CORUTZTZ'],
    ['garage_terms', 'The vehicle is accepted for inspection, diagnosis, or repair as requested by the customer.\n\nFinal repair costs will be communicated to the customer for approval before work begins.\n\nThe garage is not responsible for personal belongings left inside the vehicle. Customers should remove valuables before leaving the vehicle.\n\nThe garage may conduct test drives for diagnostic or quality assurance purposes.\n\n\nThe garage is not responsible for damages resulting from pre-existing mechanical conditions or previously damaged parts.\n\nPayment must be completed before the vehicle is released unless otherwise agreed in writing.']
  ];
  const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(([k, v]) => insert.run(k, v));
}

export default db;
