
'use server'

import db from './db';
import { revalidatePath } from 'next/cache';

// Stats
export async function getDashboardStats() {
  const openJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status != 'Closed'").get() as any;
  const completedJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status = 'Completed'").get() as any;
  const pendingPayments = db.prepare("SELECT SUM(i.snapshotJson->'$.total' - IFNULL((SELECT SUM(p.amount) FROM payments p WHERE p.invoiceId = i.id), 0)) as total FROM invoices i WHERE status != 'Paid'").get() as any;
  
  // Real stats parsing from JSON snapshots is tricky in SQLite without JSON1 extension reliably, but snapshotJson is text.
  // We'll calculate totals on the fly for demo.
  return {
    openJobs: openJobs?.count || 0,
    completedJobs: completedJobs?.count || 0,
    pendingPayments: 0, // Placeholder
    todaySales: 0,
    monthlySales: 0
  };
}

// Job Sheets
export async function getJobSheets() {
  return db.prepare(`
    SELECT js.*, c.name as customerName, v.plateNumber as vehiclePlate 
    FROM jobsheets js
    JOIN customers c ON js.customerId = c.id
    JOIN vehicles v ON js.vehicleId = v.id
    ORDER BY js.openedAt DESC
  `).all();
}

export async function getJobSheetById(id: number) {
  const job = db.prepare(`
    SELECT js.*, c.name as customerName, c.phone as customerPhone, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel
    FROM jobsheets js
    JOIN customers c ON js.customerId = c.id
    JOIN vehicles v ON js.vehicleId = v.id
    WHERE js.id = ?
  `).get(id) as any;

  if (job) {
    job.items = db.prepare('SELECT * FROM job_items WHERE jobSheetId = ?').all(id);
  }
  return job;
}

export async function createJobSheet(data: any) {
  const lastJob = db.prepare('SELECT jobNo FROM jobsheets ORDER BY id DESC LIMIT 1').get() as any;
  let nextNo = 1;
  if (lastJob) {
    nextNo = parseInt(lastJob.jobNo.split('-')[1]) + 1;
  }
  const jobNo = `JS-${nextNo.toString().padStart(4, '0')}`;

  const info = db.prepare(`
    INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(jobNo, data.customerId, data.vehicleId, data.complaint, 'Draft');

  revalidatePath('/dashboard/jobsheets');
  return info.lastInsertRowid;
}

export async function addJobItem(jobId: number, item: any) {
  const subtotal = item.qty * item.unitPrice;
  db.prepare(`
    INSERT INTO job_items (jobSheetId, type, description, qty, unitPrice, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(jobId, item.type, item.description, item.qty, item.unitPrice, subtotal);
  revalidatePath(`/dashboard/jobsheets/${jobId}`);
}

export async function deleteJobItem(itemId: number, jobId: number) {
  db.prepare('DELETE FROM job_items WHERE id = ?').run(itemId);
  revalidatePath(`/dashboard/jobsheets/${jobId}`);
}

// Customers & Vehicles
export async function getCustomers() {
  return db.prepare('SELECT * FROM customers').all();
}

export async function getVehicles() {
  return db.prepare('SELECT v.*, c.name as customerName FROM vehicles v JOIN customers c ON v.customerId = c.id').all();
}

// Proformas
export async function createProformaFromJob(jobId: number) {
  const job = await getJobSheetById(jobId);
  if (!job) return null;

  const lastPF = db.prepare('SELECT proformaNo FROM proformas ORDER BY id DESC LIMIT 1').get() as any;
  let nextNo = 1;
  if (lastPF) {
    nextNo = parseInt(lastPF.proformaNo.split('-')[1]) + 1;
  }
  const proformaNo = `PF-${nextNo.toString().padStart(4, '0')}`;

  const info = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, status)
    VALUES (?, ?, ?)
  `).run(proformaNo, jobId, 'Draft');

  revalidatePath('/dashboard/proformas');
  return info.lastInsertRowid;
}

export async function getProformas() {
  return db.prepare(`
    SELECT p.*, js.jobNo, c.name as customerName 
    FROM proformas p
    JOIN jobsheets js ON p.jobSheetId = js.id
    JOIN customers c ON js.customerId = c.id
    ORDER BY p.createdAt DESC
  `).all();
}
