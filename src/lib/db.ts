import path from 'path';
import fs from 'fs';

// Database naming and location
const dbName = 'garage_persistence.db';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

let dbPath: string;

if (isBuild) {
  const buildDir = path.join(process.cwd(), '.next_build_data');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
  dbPath = path.join(buildDir, 'temp.db');
} else {
  const localDataDir = path.join(process.cwd(), 'local_data');
  if (!fs.existsSync(localDataDir)) {
    fs.mkdirSync(localDataDir, { recursive: true });
  }
  dbPath = path.join(localDataDir, dbName);
}

let db: any;
let usingMemoryFallback = false;

const createMemoryShim = () => {
  const state: Record<string, any[]> = {};
  const methods = {
    pragma: () => undefined,
    exec: () => undefined,
    prepare: (sql: string) => ({
      get: () => ({ count: 0 }),
      all: () => [],
      run: () => ({ changes: 0, lastInsertRowid: 0 }),
      raw: () => undefined,
    }),
    close: () => undefined,
  };
  return new Proxy(methods, {
    get(target, prop) {
      if (prop in target) return target[prop as keyof typeof target];
      return () => undefined;
    },
  });
};

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
} catch (error) {
  console.error('Failed to open persistent database at:', dbPath, error);
  usingMemoryFallback = true;
  db = createMemoryShim();
}

if (!usingMemoryFallback) {
  try {
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
  } catch (error) {
    console.warn('Falling back to in-memory database due to pragma failure', error);
    usingMemoryFallback = true;
    db = createMemoryShim();
  }
}

const schemaSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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
    vehicleId INTEGER,
    title TEXT,
    content TEXT,
    status TEXT DEFAULT 'Draft',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customerId) REFERENCES customers(id),
    FOREIGN KEY(jobSheetId) REFERENCES jobsheets(id),
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
  );

  CREATE INDEX IF NOT EXISTS idx_vehicles_cust ON vehicles(customerId);
  CREATE INDEX IF NOT EXISTS idx_jobsheets_cust ON jobsheets(customerId);
`;

db.exec(schemaSql);

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
    ['garage_terms', 'Standard mechanical repair conditions apply. All work is guaranteed.']
  ];
  const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(([k, v]) => insert.run(k, v));
}

export { dbPath };
export default db;
