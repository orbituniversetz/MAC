'use server'

import db from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getDashboardStats() {
  const openJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status != 'Closed'").get() as any;
  const completedJobs = db.prepare("SELECT COUNT(*) as count FROM jobsheets WHERE status = 'Completed'").get() as any;
  const totalSales = db.prepare("SELECT SUM(amount) as total FROM payments").get() as any;
  
  return {
    openJobs: openJobs?.count || 0,
    completedJobs: completedJobs?.count || 0,
    pendingPayments: 0,
    todaySales: 0,
    monthlySales: totalSales?.total || 0
  };
}

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

export async function createJobSheet(formData: FormData) {
  let customerId = formData.get('customerId') ? parseInt(formData.get('customerId') as string) : null;
  const newCustomerName = formData.get('newCustomerName') as string;
  const newCustomerPhone = formData.get('newCustomerPhone') as string;
  
  let vehicleId = formData.get('vehicleId') ? parseInt(formData.get('vehicleId') as string) : null;
  const newVehiclePlate = formData.get('newVehiclePlate') as string;
  const newVehicleModel = formData.get('newVehicleModel') as string;

  if (!customerId && newCustomerName) {
    const info = db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)').run(newCustomerName, newCustomerPhone);
    customerId = info.lastInsertRowid as number;
  }

  if (!vehicleId && newVehiclePlate && customerId) {
    const info = db.prepare('INSERT INTO vehicles (customerId, plateNumber, makeModel) VALUES (?, ?, ?)').run(customerId, newVehiclePlate, newVehicleModel);
    vehicleId = info.lastInsertRowid as number;
  }

  if (!customerId || !vehicleId) {
    throw new Error("Customer and Vehicle are required.");
  }

  const complaint = formData.get('complaint') as string;

  const lastJob = db.prepare('SELECT jobNo FROM jobsheets ORDER BY id DESC LIMIT 1').get() as any;
  let nextNo = 1;
  if (lastJob && lastJob.jobNo.includes('-')) {
    nextNo = parseInt(lastJob.jobNo.split('-')[1]) + 1;
  }
  const jobNo = `JS-${nextNo.toString().padStart(4, '0')}`;

  const info = db.prepare(`
    INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(jobNo, customerId, vehicleId, complaint, 'Draft');

  const newId = info.lastInsertRowid;
  revalidatePath('/dashboard/jobsheets');
  redirect(`/dashboard/jobsheets/${newId}`);
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

export async function getCustomers() {
  return db.prepare('SELECT * FROM customers ORDER BY name ASC').all() as any[];
}

export async function getAllVehicles() {
  return db.prepare('SELECT v.*, c.name as customerName FROM vehicles v JOIN customers c ON v.customerId = c.id ORDER BY v.plateNumber ASC').all() as any[];
}

export async function createProformaFromJob(jobId: number) {
  const job = await getJobSheetById(jobId);
  if (!job) return null;

  const lastPF = db.prepare('SELECT proformaNo FROM proformas ORDER BY id DESC LIMIT 1').get() as any;
  let nextNo = 1;
  if (lastPF && lastPF.proformaNo.includes('-')) {
    nextNo = parseInt(lastPF.proformaNo.split('-')[1]) + 1;
  }
  const proformaNo = `PF-${nextNo.toString().padStart(4, '0')}`;

  const info = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(proformaNo, jobId, job.customerId, job.vehicleId, 'Draft');

  revalidatePath('/dashboard/proformas');
  return info.lastInsertRowid;
}

export async function createProformaDirect(formData: FormData) {
  let customerId = formData.get('customerId') ? parseInt(formData.get('customerId') as string) : null;
  const newCustomerName = formData.get('newCustomerName') as string;
  const newCustomerPhone = formData.get('newCustomerPhone') as string;
  
  let vehicleId = formData.get('vehicleId') ? parseInt(formData.get('vehicleId') as string) : null;
  const newVehiclePlate = formData.get('newVehiclePlate') as string;

  if (!customerId && newCustomerName) {
    const info = db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)').run(newCustomerName, newCustomerPhone);
    customerId = info.lastInsertRowid as number;
  }

  if (!vehicleId && newVehiclePlate && customerId) {
    const info = db.prepare('INSERT INTO vehicles (customerId, plateNumber) VALUES (?, ?)').run(customerId, newVehiclePlate);
    vehicleId = info.lastInsertRowid as number;
  }

  const lastPF = db.prepare('SELECT proformaNo FROM proformas ORDER BY id DESC LIMIT 1').get() as any;
  let nextNo = 1;
  if (lastPF && lastPF.proformaNo.includes('-')) {
    nextNo = parseInt(lastPF.proformaNo.split('-')[1]) + 1;
  }
  const proformaNo = `PF-${nextNo.toString().padStart(4, '0')}`;

  const info = db.prepare(`
    INSERT INTO proformas (proformaNo, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?)
  `).run(proformaNo, customerId, vehicleId, 'Draft');

  revalidatePath('/dashboard/proformas');
  redirect(`/dashboard/proformas/${info.lastInsertRowid}`);
}

export async function getProformas() {
  return db.prepare(`
    SELECT p.*, js.jobNo, c.name as customerName, v.plateNumber as vehiclePlate
    FROM proformas p
    LEFT JOIN jobsheets js ON p.jobSheetId = js.id
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    ORDER BY p.createdAt DESC
  `).all();
}

export async function getProformaById(id: number) {
  const pf = db.prepare(`
    SELECT p.*, c.name as customerName, c.phone as customerPhone, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel, js.jobNo
    FROM proformas p
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    LEFT JOIN jobsheets js ON p.jobSheetId = js.id
    WHERE p.id = ?
  `).get(id) as any;

  if (pf) {
    const itemsFromJob = pf.jobSheetId ? db.prepare('SELECT * FROM job_items WHERE jobSheetId = ?').all(pf.jobSheetId) : [];
    const itemsFromPF = db.prepare('SELECT * FROM job_items WHERE proformaId = ?').all(id);
    pf.items = [...itemsFromJob, ...itemsFromPF];
  }
  return pf;
}

export async function getInvoices() {
  return db.prepare(`
    SELECT i.*, js.jobNo, c.name as customerName 
    FROM invoices i
    LEFT JOIN jobsheets js ON i.jobSheetId = js.id
    LEFT JOIN customers c ON js.customerId = c.id
    ORDER BY i.createdAt DESC
  `).all();
}

export async function getSettings() {
  const settings = db.prepare('SELECT * FROM settings').all() as any[];
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as any);
}

export async function updateSetting(key: string, value: string) {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  revalidatePath('/dashboard/settings');
}