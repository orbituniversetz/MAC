
'use server'

import db, { dbPath } from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';

export const getDashboardStats = cache(async () => {
  const openJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status != 'Closed'").get() as any;
  const completedJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status = 'Completed'").get() as any;
  const totalSales = db.prepare("SELECT SUM(subtotal) as total FROM job_items").get() as any;
  const totalExpenses = db.prepare("SELECT SUM(amount) as total FROM expenses").get() as any;
  
  return {
    openJobs: openJobs?.count || 0,
    completedJobs: completedJobs?.count || 0,
    monthlySales: totalSales?.total || 0,
    totalExpenses: totalExpenses?.total || 0,
    netProfit: (totalSales?.total || 0) - (totalExpenses?.total || 0)
  };
});

// Database Backup/Restore Actions
export async function exportDatabase() {
  try {
    const data = fs.readFileSync(dbPath);
    const base64 = data.toString('base64');
    return { success: true, data: base64, filename: `garage_backup_${Date.now()}.sqlite` };
  } catch (error) {
    return { success: false, error: 'Failed to read database file' };
  }
}

export async function importDatabase(base64Data: string) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    // Ensure WAL mode is closed before overwriting
    db.close();
    fs.writeFileSync(dbPath, buffer);
    // Force process restart or just notify user to restart app
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to write database file' };
  }
}

export const getJobSheets = cache(async () => {
  return db.prepare(`
    SELECT js.*, c.name as customerName, v.plateNumber as vehiclePlate 
    FROM jobsheets js
    JOIN customers c ON js.customerId = c.id
    JOIN vehicles v ON js.vehicleId = v.id
    ORDER BY js.openedAt DESC
  `).all();
});

export const getJobSheetById = cache(async (id: number) => {
  const job = db.prepare(`
    SELECT js.*, c.name as customerName, c.phone as customerPhone, c.address as customerAddress, c.tin as customerTin, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel
    FROM jobsheets js
    JOIN customers c ON js.customerId = c.id
    JOIN vehicles v ON js.vehicleId = v.id
    WHERE js.id = ?
  `).get(id) as any;

  if (job) {
    job.items = db.prepare('SELECT * FROM job_items WHERE jobSheetId = ?').all(id);
    job.expenses = db.prepare('SELECT * FROM expenses WHERE jobSheetId = ?').all(id);
  }
  return job;
});

export async function createJobSheet(formData: FormData) {
  let customerId = formData.get('customerId') ? parseInt(formData.get('customerId') as string) : null;
  const newCustomerName = formData.get('newCustomerName') as string;
  const newCustomerPhone = formData.get('newCustomerPhone') as string;
  const newCustomerAddress = formData.get('newCustomerAddress') as string;
  const newCustomerTin = formData.get('newCustomerTin') as string;
  
  let vehicleId = formData.get('vehicleId') ? parseInt(formData.get('vehicleId') as string) : null;
  const newVehiclePlate = formData.get('newVehiclePlate') as string;
  const newVehicleModel = formData.get('newVehicleModel') as string;

  if (!customerId && newCustomerName) {
    const info = db.prepare('INSERT INTO customers (name, phone, address, tin) VALUES (?, ?, ?, ?)').run(newCustomerName, newCustomerPhone, newCustomerAddress, newCustomerTin);
    customerId = info.lastInsertRowid as number;
  }

  if (!vehicleId && newVehiclePlate && customerId) {
    const info = db.prepare('INSERT INTO vehicles (customerId, plateNumber, makeModel) VALUES (?, ?, ?)').run(customerId, newVehiclePlate, newVehicleModel);
    vehicleId = info.lastInsertRowid as number;
  }

  const complaint = formData.get('complaint') as string;
  const jobNo = `JS-${Date.now().toString().slice(-6)}`;

  const info = db.prepare(`
    INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(jobNo, customerId, vehicleId, complaint, 'Draft');

  revalidatePath('/dashboard/jobsheets');
  redirect(`/dashboard/jobsheets/${info.lastInsertRowid}`);
}

export async function addJobItem(jobId: number | null, proformaId: number | null, item: any) {
  const subtotal = item.qty * item.unitPrice;
  db.prepare(`
    INSERT INTO job_items (jobSheetId, proformaId, type, description, qty, unitPrice, subtotal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(jobId, proformaId, item.type, item.description, item.qty, item.unitPrice, subtotal);
  
  if (jobId) revalidatePath(`/dashboard/jobsheets/${jobId}`);
  if (proformaId) revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export async function deleteJobItem(itemId: number, jobId: number | null, proformaId: number | null) {
  db.prepare('DELETE FROM job_items WHERE id = ?').run(itemId);
  if (jobId) revalidatePath(`/dashboard/jobsheets/${jobId}`);
  if (proformaId) revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export async function addExpense(formData: FormData) {
  const jobSheetId = formData.get('jobSheetId') ? parseInt(formData.get('jobSheetId') as string) : null;
  const proformaId = formData.get('proformaId') ? parseInt(formData.get('proformaId') as string) : null;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const amount = parseFloat(formData.get('amount') as string);

  db.prepare(`
    INSERT INTO expenses (jobSheetId, proformaId, description, category, amount)
    VALUES (?, ?, ?, ?, ?)
  `).run(jobSheetId, proformaId, description, category, amount);
  
  revalidatePath('/dashboard/expenses');
  if (jobSheetId) revalidatePath(`/dashboard/jobsheets/${jobSheetId}`);
  if (proformaId) revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export async function deleteExpense(id: number, jobSheetId: number | null, proformaId: number | null) {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  revalidatePath('/dashboard/expenses');
  if (jobSheetId) revalidatePath(`/dashboard/jobsheets/${jobSheetId}`);
}

export const getExpenses = cache(async () => {
  return db.prepare(`
    SELECT e.*, js.jobNo, p.proformaNo
    FROM expenses e
    LEFT JOIN jobsheets js ON e.jobSheetId = js.id
    LEFT JOIN proformas p ON e.proformaId = p.id
    ORDER BY e.date DESC
  `).all();
});

export const getCustomers = cache(async () => {
  return db.prepare('SELECT * FROM customers ORDER BY name ASC').all();
});

export const getAllVehicles = cache(async () => {
  return db.prepare('SELECT v.*, c.name as customerName FROM vehicles v JOIN customers c ON v.customerId = c.id ORDER BY v.plateNumber ASC').all();
});

export const getProformas = cache(async () => {
  return db.prepare(`
    SELECT p.*, js.jobNo, c.name as customerName, v.plateNumber as vehiclePlate
    FROM proformas p
    LEFT JOIN jobsheets js ON p.jobSheetId = js.id
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    ORDER BY p.createdAt DESC
  `).all();
});

export const getProformaById = cache(async (id: number) => {
  const pf = db.prepare(`
    SELECT p.*, c.name as customerName, c.phone as customerPhone, c.address as customerAddress, c.tin as customerTin, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel, js.jobNo
    FROM proformas p
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    LEFT JOIN jobsheets js ON p.jobSheetId = js.id
    WHERE p.id = ?
  `).get(id) as any;

  if (pf) {
    pf.items = db.prepare('SELECT * FROM job_items WHERE proformaId = ? OR jobSheetId = ?').all(id, pf.jobSheetId);
    pf.payments = db.prepare('SELECT * FROM payments WHERE proformaId = ? ORDER BY paidAt DESC').all(id);
    pf.totalPaid = pf.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
  }
  return pf;
});

export async function finalizeProforma(id: number) {
  db.prepare("UPDATE proformas SET status = 'Finalized' WHERE id = ?").run(id);
  revalidatePath(`/dashboard/proformas/${id}`);
}

export async function recordProformaPayment(formData: FormData) {
  const proformaId = parseInt(formData.get('proformaId') as string);
  const amount = parseFloat(formData.get('amount') as string);
  db.prepare('INSERT INTO payments (proformaId, amount, method) VALUES (?, ?, ?)').run(proformaId, amount, 'Cash');
  revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export async function updateProformaDiscount(id: number, discount: number) {
  db.prepare('UPDATE proformas SET discount = ? WHERE id = ?').run(discount, id);
  revalidatePath(`/dashboard/proformas/${id}`);
}

export async function updateProformaTaxStatus(id: number, enabled: boolean) {
  db.prepare('UPDATE proformas SET taxEnabled = ? WHERE id = ?').run(enabled ? 1 : 0, id);
  revalidatePath(`/dashboard/proformas/${id}`);
}

export const getInvoices = cache(async () => {
  return db.prepare(`
    SELECT i.*, js.jobNo, c.name as customerName 
    FROM invoices i
    LEFT JOIN jobsheets js ON i.jobSheetId = js.id
    LEFT JOIN customers c ON i.id = c.id
    ORDER BY i.createdAt DESC
  `).all();
});

export const getInvoiceById = cache(async (id: number) => {
  const inv = db.prepare(`
    SELECT i.*, js.jobNo, c.name as customerName, c.phone as customerPhone, c.address as customerAddress, c.tin as customerTin, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel
    FROM invoices i
    LEFT JOIN jobsheets js ON i.jobSheetId = js.id
    LEFT JOIN customers c ON js.customerId = c.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE i.id = ?
  `).get(id) as any;

  if (inv && inv.snapshotJson) {
    inv.snapshot = JSON.parse(inv.snapshotJson);
  }
  return inv;
});

export const getSettings = cache(async () => {
  const settings = db.prepare('SELECT * FROM settings').all() as any[];
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as any);
});

export async function updateAllSettings(settings: Record<string, string>) {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(settings)) {
    stmt.run(key, value);
  }
  revalidatePath('/dashboard/settings');
}

export const getDocuments = cache(async () => {
  return db.prepare(`
    SELECT d.*, c.name as customerName, js.jobNo 
    FROM documents d
    LEFT JOIN customers c ON d.customerId = c.id
    LEFT JOIN jobsheets js ON d.jobSheetId = js.id
    ORDER BY d.createdAt DESC
  `).all();
});

export const getDocumentById = cache(async (id: number) => {
  return db.prepare(`
    SELECT d.*, c.name as customerName, c.phone as customerPhone, c.address as customerAddress, c.tin as customerTin,
           js.jobNo, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel
    FROM documents d
    LEFT JOIN customers c ON d.customerId = c.id
    LEFT JOIN jobsheets js ON d.jobSheetId = js.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE d.id = ?
  `).get(id) as any;
});

export async function createDocument(formData: FormData) {
  const docType = formData.get('docType') as string;
  const customerId = parseInt(formData.get('customerId') as string);
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const docNo = `${docType === 'LETTER' ? 'LTR' : 'REP'}-${Date.now().toString().slice(-6)}`;

  const info = db.prepare(`
    INSERT INTO documents (docType, docNo, customerId, title, content)
    VALUES (?, ?, ?, ?, ?)
  `).run(docType, docNo, customerId, title, content);

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents/${info.lastInsertRowid}`);
}

export const getRecentItems = cache(async () => {
  return db.prepare(`SELECT DISTINCT type, description, unitPrice FROM job_items LIMIT 20`).all();
});

export const getRecentExpenses = cache(async () => {
  return db.prepare(`SELECT DISTINCT category, description, amount FROM expenses LIMIT 20`).all();
});

export async function deleteDocument(id: number) {
  db.prepare('DELETE FROM documents WHERE id = ?').run(id);
  revalidatePath('/dashboard/documents');
}

export async function convertToInvoice(pfId: number) {
  const pf = await getProformaById(pfId);
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
  const snapshot = JSON.stringify(pf);
  const info = db.prepare('INSERT INTO invoices (invoiceNo, jobSheetId, proformaId, snapshotJson) VALUES (?, ?, ?, ?)').run(invoiceNo, pf.jobSheetId, pfId, snapshot);
  db.prepare("UPDATE proformas SET status = 'Invoiced' WHERE id = ?").run(pfId);
  revalidatePath('/dashboard/invoices');
  redirect(`/dashboard/invoices/${info.lastInsertRowid}`);
}

export async function createProformaFromJob(jobId: number) {
  const job = await getJobSheetById(jobId);
  const proformaNo = `PF-${Date.now().toString().slice(-6)}`;
  
  const info = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(proformaNo, jobId, job.customerId, job.vehicleId, 'Draft');
  
  revalidatePath(`/dashboard/jobsheets/${jobId}`);
  return info.lastInsertRowid;
}

export async function createReportFromJob(jobId: number) {
  const job = await getJobSheetById(jobId);
  const docNo = `REP-${Date.now().toString().slice(-6)}`;
  
  const info = db.prepare(`
    INSERT INTO documents (docType, docNo, customerId, jobSheetId, title, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('REPORT', docNo, job.customerId, jobId, `Inspection Report for ${job.vehiclePlate}`, job.complaint);
  
  revalidatePath(`/dashboard/jobsheets/${jobId}`);
  return info.lastInsertRowid;
}

export async function saveProformaDraft(id: number) {
  db.prepare("UPDATE proformas SET status = 'Draft' WHERE id = ?").run(id);
  revalidatePath(`/dashboard/proformas/${id}`);
}

export async function createProformaDirect(formData: FormData) {
  let customerId = formData.get('customerId') ? parseInt(formData.get('customerId') as string) : null;
  const newCustomerName = formData.get('newCustomerName') as string;
  const newCustomerPhone = formData.get('newCustomerPhone') as string;
  const newCustomerAddress = formData.get('newCustomerAddress') as string;
  const newCustomerTin = formData.get('newCustomerTin') as string;
  
  let vehicleId = formData.get('vehicleId') ? parseInt(formData.get('vehicleId') as string) : null;
  const newVehiclePlate = formData.get('newVehiclePlate') as string;
  const newVehicleModel = formData.get('newVehicleModel') as string;

  if (!customerId && newCustomerName) {
    const info = db.prepare('INSERT INTO customers (name, phone, address, tin) VALUES (?, ?, ?, ?)').run(newCustomerName, newCustomerPhone, newCustomerAddress, newCustomerTin);
    customerId = info.lastInsertRowid as number;
  }

  if (!vehicleId && newVehiclePlate && customerId) {
    const info = db.prepare('INSERT INTO vehicles (customerId, plateNumber, makeModel) VALUES (?, ?, ?)').run(customerId, newVehiclePlate, newVehicleModel);
    vehicleId = info.lastInsertRowid as number;
  }

  const description = formData.get('description') as string;
  const jobNo = `JS-${Date.now().toString().slice(-6)}`;
  const proformaNo = `PF-${Date.now().toString().slice(-6)}`;

  const jobInfo = db.prepare(`
    INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(jobNo, customerId, vehicleId, description, 'Draft');

  const pfInfo = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(proformaNo, jobInfo.lastInsertRowid, customerId, vehicleId, 'Draft');

  revalidatePath('/dashboard/proformas');
  redirect(`/dashboard/proformas/${pfInfo.lastInsertRowid}`);
}
