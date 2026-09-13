
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
    db.close();
    fs.writeFileSync(dbPath, buffer);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to write database file' };
  }
}

export const getJobSheets = cache(async () => {
  return db.prepare(`
    SELECT js.*, c.name as customerName, v.plateNumber as vehiclePlate 
    FROM jobsheets js
    LEFT JOIN customers c ON js.customerId = c.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE (js.isDeleted = 0 OR js.isDeleted IS NULL)
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
  `).run(jobNo, customerId, vehicleId, complaint, 'Work In Progress');

  revalidatePath('/dashboard/jobsheets');
  redirect(`/dashboard/jobsheets/${info.lastInsertRowid}`);
}

export async function updateJobSheet(id: number, data: { complaint: string, status: string }) {
  db.prepare('UPDATE jobsheets SET complaint = ?, status = ? WHERE id = ?').run(data.complaint, data.status, id);
  revalidatePath(`/dashboard/jobsheets/${id}`);
  revalidatePath('/dashboard/jobsheets');
}

export async function deleteJobSheet(id: number) {
  db.prepare('UPDATE jobsheets SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/jobsheets');
  revalidatePath('/dashboard/trash');
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

export async function updateJobItem(id: number, jobId: number | null, proformaId: number | null, item: any) {
  const subtotal = item.qty * item.unitPrice;
  db.prepare(`
    UPDATE job_items 
    SET type = ?, description = ?, qty = ?, unitPrice = ?, subtotal = ?
    WHERE id = ?
  `).run(item.type, item.description, item.qty, item.unitPrice, subtotal, id);
  
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

export async function updateExpense(id: number, data: { description: string, category: string, amount: number }) {
  db.prepare('UPDATE expenses SET description = ?, category = ?, amount = ? WHERE id = ?').run(data.description, data.category, data.amount, id);
  const exp = db.prepare('SELECT jobSheetId, proformaId FROM expenses WHERE id = ?').get(id) as any;
  revalidatePath('/dashboard/expenses');
  if (exp?.jobSheetId) revalidatePath(`/dashboard/jobsheets/${exp.jobSheetId}`);
  if (exp?.proformaId) revalidatePath(`/dashboard/proformas/${exp.proformaId}`);
}

export async function deleteExpense(id: number, jobSheetId: number | null, proformaId: number | null) {
  db.prepare('UPDATE expenses SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/expenses');
  revalidatePath('/dashboard/trash');
  if (jobSheetId) revalidatePath(`/dashboard/jobsheets/${jobSheetId}`);
  if (proformaId) revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export const getExpenses = cache(async () => {
  return db.prepare(`
    SELECT e.*, js.jobNo, p.proformaNo
    FROM expenses e
    LEFT JOIN jobsheets js ON e.jobSheetId = js.id
    LEFT JOIN proformas p ON e.proformaId = p.id
    WHERE (e.isDeleted = 0 OR e.isDeleted IS NULL)
    ORDER BY e.date DESC
  `).all();
});

export const getCustomers = cache(async () => {
  return db.prepare('SELECT * FROM customers WHERE (isDeleted = 0 OR isDeleted IS NULL) ORDER BY name ASC').all();
});

export const getAllVehicles = cache(async () => {
  return db.prepare('SELECT v.*, c.name as customerName FROM vehicles v LEFT JOIN customers c ON v.customerId = c.id WHERE (v.isDeleted = 0 OR v.isDeleted IS NULL) ORDER BY v.plateNumber ASC').all();
});

export const getProformas = cache(async () => {
  return db.prepare(`
    SELECT p.*, js.jobNo, c.name as customerName, v.plateNumber as vehiclePlate
    FROM proformas p
    LEFT JOIN jobsheets js ON p.jobSheetId = js.id
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    WHERE (p.isDeleted = 0 OR p.isDeleted IS NULL)
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

export async function deleteProforma(id: number) {
  db.prepare('UPDATE proformas SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/proformas');
  revalidatePath('/dashboard/trash');
}

export async function finalizeProforma(id: number) {
  const proforma = db.prepare('SELECT jobSheetId FROM proformas WHERE id = ?').get(id) as any;
  db.prepare("UPDATE proformas SET status = 'Quoted' WHERE id = ?").run(id);
  if (proforma?.jobSheetId) db.prepare("UPDATE jobsheets SET status = 'Quoted' WHERE id = ? AND status != 'Completed'").run(proforma.jobSheetId);
  revalidatePath(`/dashboard/proformas/${id}`);
}

export async function updateProformaStatus(id: number, status: string) {
  const proforma = db.prepare('SELECT jobSheetId FROM proformas WHERE id = ?').get(id) as any;
  db.prepare("UPDATE proformas SET status = ? WHERE id = ?").run(status, id);
  if (status === 'Quoted' && proforma?.jobSheetId) {
    db.prepare("UPDATE jobsheets SET status = 'Quoted' WHERE id = ? AND status != 'Completed'").run(proforma.jobSheetId);
  }
  revalidatePath(`/dashboard/proformas/${id}`);
  revalidatePath('/dashboard/proformas');
}

export async function recordProformaPayment(formData: FormData) {
  const proformaId = parseInt(formData.get('proformaId') as string);
  const rawAmount = (formData.get('amount') as string || '').replace(/,/g, '');
  const amount = parseFloat(rawAmount);
  const method = (formData.get('method') as string) || 'Cash';
  const reference = (formData.get('reference') as string) || '';
  
  db.prepare('INSERT INTO payments (proformaId, amount, method, reference) VALUES (?, ?, ?, ?)').run(proformaId, amount, method, reference);
  revalidatePath(`/dashboard/proformas/${proformaId}`);
}

export async function recordPayment(formData: FormData) {
  const invoiceIdRaw = formData.get('invoiceId') as string;
  const proformaIdRaw = formData.get('proformaId') as string;
  const invoiceId = invoiceIdRaw && !isNaN(parseInt(invoiceIdRaw)) ? parseInt(invoiceIdRaw) : null;
  const proformaId = proformaIdRaw && !isNaN(parseInt(proformaIdRaw)) ? parseInt(proformaIdRaw) : null;
  
  const rawAmount = (formData.get('amount') as string || '').replace(/,/g, '');
  const amount = parseFloat(rawAmount);
  if (!amount || isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Invalid payment amount' };
  }
  
  const method = (formData.get('method') as string) || 'Cash';
  const reference = (formData.get('reference') as string) || '';
  const paidAtInput = formData.get('paidAt') as string;
  const paidAt = paidAtInput ? new Date(paidAtInput).toISOString() : new Date().toISOString();

  db.prepare(`
    INSERT INTO payments (invoiceId, proformaId, amount, method, reference, paidAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(invoiceId, proformaId, amount, method, reference, paidAt);

  if (invoiceId) {
    await syncInvoicePaymentStatus(invoiceId);
  } else if (proformaId) {
    const inv = db.prepare('SELECT id FROM invoices WHERE proformaId = ?').get(proformaId) as any;
    if (inv?.id) {
      await syncInvoicePaymentStatus(inv.id);
    }
  }

  if (invoiceId) revalidatePath(`/dashboard/invoices/${invoiceId}`);
  if (proformaId) revalidatePath(`/dashboard/proformas/${proformaId}`);
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/proformas');
  
  return { success: true };
}

export async function syncInvoicePaymentStatus(invoiceId: number) {
  const inv = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId) as any;
  if (!inv) return;
  
  let total = 0;
  if (inv.snapshotJson) {
    const snapshot = JSON.parse(inv.snapshotJson);
    const subtotal = snapshot.items?.reduce((acc: number, item: any) => acc + item.subtotal, 0) || 0;
    const discount = snapshot.discount || 0;
    const taxEnabled = snapshot.taxEnabled === 1;
    const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
    total = subtotal - discount + taxAmount;
  }
  
  const payments = inv.proformaId 
    ? db.prepare('SELECT amount FROM payments WHERE invoiceId = ? OR proformaId = ?').all(invoiceId, inv.proformaId) as any[]
    : db.prepare('SELECT amount FROM payments WHERE invoiceId = ?').all(invoiceId) as any[];
    
  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  
  let newStatus = 'Invoiced';
  if (totalPaid >= total && total > 0) {
    newStatus = 'Completed';
  }
  
  if (inv.status !== 'Cancelled' || totalPaid > 0) {
    db.prepare('UPDATE invoices SET status = ? WHERE id = ?').run(newStatus, invoiceId);
    if (inv.jobSheetId) {
      db.prepare("UPDATE jobsheets SET status = ?, closedAt = CASE WHEN ? = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = ?")
        .run(newStatus, newStatus, inv.jobSheetId);
    }
  }
}

export async function deletePayment(paymentId: number, invoiceId?: number, proformaId?: number) {
  let invId = invoiceId;
  let pfId = proformaId;
  
  const p = db.prepare('SELECT invoiceId, proformaId FROM payments WHERE id = ?').get(paymentId) as any;
  if (p) {
    if (!invId) invId = p.invoiceId;
    if (!pfId) pfId = p.proformaId;
  }

  db.prepare('DELETE FROM payments WHERE id = ?').run(paymentId);

  if (invId) {
    await syncInvoicePaymentStatus(invId);
  } else if (pfId) {
    const inv = db.prepare('SELECT id FROM invoices WHERE proformaId = ?').get(pfId) as any;
    if (inv?.id) {
      await syncInvoicePaymentStatus(inv.id);
    }
  }

  if (invId) revalidatePath(`/dashboard/invoices/${invId}`);
  if (pfId) revalidatePath(`/dashboard/proformas/${pfId}`);
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/proformas');
  revalidatePath('/dashboard/jobsheets');
  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard/vehicles');
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
    LEFT JOIN customers c ON js.customerId = c.id
    WHERE (i.isDeleted = 0 OR i.isDeleted IS NULL)
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

  if (inv) {
    if (inv.snapshotJson) {
      inv.snapshot = JSON.parse(inv.snapshotJson);
    }
    if (inv.proformaId) {
      inv.payments = db.prepare('SELECT * FROM payments WHERE invoiceId = ? OR proformaId = ? ORDER BY paidAt DESC').all(id, inv.proformaId);
    } else {
      inv.payments = db.prepare('SELECT * FROM payments WHERE invoiceId = ? ORDER BY paidAt DESC').all(id);
    }
    inv.totalPaid = (inv.payments || []).reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
  }
  return inv;
});

export async function updateInvoiceStatus(id: number, status: string) {
  db.prepare("UPDATE invoices SET status = ? WHERE id = ?").run(status, id);
  revalidatePath(`/dashboard/invoices/${id}`);
  revalidatePath('/dashboard/invoices');
}

export async function deleteInvoice(id: number) {
  db.prepare('UPDATE invoices SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/trash');
}

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
    WHERE (d.isDeleted = 0 OR d.isDeleted IS NULL)
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
    LEFT JOIN vehicles v ON d.vehicleId = v.id
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
  db.prepare('UPDATE documents SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/documents');
  revalidatePath('/dashboard/trash');
}

export async function convertToInvoice(pfId: number) {
  const pf = await getProformaById(pfId);
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
  const snapshot = JSON.stringify(pf);
  const info = db.prepare('INSERT INTO invoices (invoiceNo, jobSheetId, proformaId, snapshotJson, customerId) VALUES (?, ?, ?, ?, ?)').run(invoiceNo, pf.jobSheetId, pfId, snapshot, pf.customerId);
  const newInvoiceId = info.lastInsertRowid as number;
  
  // Link existing proforma deposit/payments to the new invoice
  db.prepare('UPDATE payments SET invoiceId = ? WHERE proformaId = ?').run(newInvoiceId, pfId);
  
  db.prepare("UPDATE proformas SET status = 'Invoiced' WHERE id = ?").run(pfId);
  if (pf.jobSheetId) db.prepare("UPDATE jobsheets SET status = 'Invoiced' WHERE id = ? AND status != 'Completed'").run(pf.jobSheetId);
  
  // Sync payment status on the new invoice
  await syncInvoicePaymentStatus(newInvoiceId);
  
  revalidatePath('/dashboard/invoices');
  redirect(`/dashboard/invoices/${newInvoiceId}`);
}

export async function createProformaFromJob(jobId: number) {
  const job = await getJobSheetById(jobId);
  const proformaNo = `PF-${Date.now().toString().slice(-6)}`;
  
  const info = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(proformaNo, jobId, job.customerId, job.vehicleId, 'Quoted');
  db.prepare("UPDATE jobsheets SET status = 'Quoted' WHERE id = ? AND status != 'Completed'").run(jobId);
  
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
  await finalizeProforma(id);
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
  `).run(jobNo, customerId, vehicleId, description, 'Quoted');

  const pfInfo = db.prepare(`
    INSERT INTO proformas (proformaNo, jobSheetId, customerId, vehicleId, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(proformaNo, jobInfo.lastInsertRowid, customerId, vehicleId, 'Quoted');

  revalidatePath('/dashboard/proformas');
  redirect(`/dashboard/proformas/${pfInfo.lastInsertRowid}`);
}

export async function createInvoiceDirect(formData: FormData) {
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

  const itemsJsonRaw = formData.get('itemsJson') as string;
  let items: any[] = [];
  try {
    items = itemsJsonRaw ? JSON.parse(itemsJsonRaw) : [];
  } catch (err) {
    items = [];
  }

  const discountRaw = (formData.get('discount') as string || '').replace(/,/g, '');
  const discount = parseFloat(discountRaw) || 0;
  const taxEnabled = formData.get('taxEnabled') === 'false' ? 0 : 1;
  const createdAtInput = formData.get('createdAt') as string;
  const createdAt = createdAtInput ? new Date(createdAtInput).toISOString() : new Date().toISOString();

  const jobNo = `JS-${Date.now().toString().slice(-6)}`;
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  const jobInfo = db.prepare(`
    INSERT INTO jobsheets (jobNo, customerId, vehicleId, complaint, status, openedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(jobNo, customerId, vehicleId, 'Direct Invoice Creation', 'Invoiced', createdAt);

  const jobId = jobInfo.lastInsertRowid as number;

  items.forEach((item: any) => {
    const qty = parseFloat(item.qty) || 1;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const subtotal = qty * unitPrice;
    db.prepare(`
      INSERT INTO job_items (jobSheetId, type, description, qty, unitPrice, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(jobId, item.type || 'SERVICE', item.description || '', qty, unitPrice, subtotal);
  });

  const customer = customerId ? db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId) as any : null;
  const vehicle = vehicleId ? db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicleId) as any : null;
  const jobItems = db.prepare('SELECT * FROM job_items WHERE jobSheetId = ?').all(jobId);

  const snapshot = {
    items: jobItems,
    discount,
    taxEnabled,
    customerName: customer?.name || newCustomerName,
    customerPhone: customer?.phone || newCustomerPhone,
    customerAddress: customer?.address || newCustomerAddress,
    customerTin: customer?.tin || newCustomerTin,
    vehiclePlate: vehicle?.plateNumber || newVehiclePlate,
    vehicleModel: vehicle?.makeModel || newVehicleModel,
    jobNo,
    createdAt
  };

  const snapshotJson = JSON.stringify(snapshot);

  const invInfo = db.prepare(`
    INSERT INTO invoices (invoiceNo, jobSheetId, customerId, status, snapshotJson, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(invoiceNo, jobId, customerId, 'Invoiced', snapshotJson, createdAt);

  revalidatePath('/dashboard/invoices');
  redirect(`/dashboard/invoices/${invInfo.lastInsertRowid}`);
}

export async function deleteCustomer(id: number) {
  db.prepare('UPDATE customers SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard/trash');
}

export async function deleteVehicle(id: number) {
  db.prepare('UPDATE vehicles SET isDeleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  revalidatePath('/dashboard/vehicles');
  revalidatePath('/dashboard/trash');
}

export async function createCustomer(data: { name: string; phone: string; address: string; tin: string }) {
  db.prepare('INSERT INTO customers (name, phone, address, tin) VALUES (?, ?, ?, ?)').run(data.name, data.phone, data.address, data.tin);
  revalidatePath('/dashboard/customers');
}

export async function updateCustomer(id: number, data: { name: string; phone: string; address: string; tin: string }) {
  db.prepare('UPDATE customers SET name = ?, phone = ?, address = ?, tin = ? WHERE id = ?').run(data.name, data.phone, data.address, data.tin, id);
  revalidatePath('/dashboard/customers');
}

export async function createVehicle(data: { customerId: number; plateNumber: string; makeModel: string }) {
  db.prepare('INSERT INTO vehicles (customerId, plateNumber, makeModel) VALUES (?, ?, ?)').run(data.customerId, data.plateNumber, data.makeModel);
  revalidatePath('/dashboard/vehicles');
}

export async function updateVehicle(id: number, data: { customerId: number; plateNumber: string; makeModel: string }) {
  db.prepare('UPDATE vehicles SET customerId = ?, plateNumber = ?, makeModel = ? WHERE id = ?').run(data.customerId, data.plateNumber, data.makeModel, id);
  revalidatePath('/dashboard/vehicles');
}

export const getVehicleHistory = cache(async (vehicleId: number) => {
  const vehicle = db.prepare(`
    SELECT v.*, c.name as customerName, c.phone as customerPhone, c.address as customerAddress, c.tin as customerTin
    FROM vehicles v
    LEFT JOIN customers c ON v.customerId = c.id
    WHERE v.id = ?
  `).get(vehicleId) as any;

  if (!vehicle) return null;

  const jobSheets = db.prepare(`
    SELECT js.*, 
      (SELECT SUM(subtotal) FROM job_items WHERE jobSheetId = js.id) as totalIncome,
      (SELECT SUM(amount) FROM expenses WHERE jobSheetId = js.id) as totalCosts
    FROM jobsheets js
    WHERE js.vehicleId = ?
    ORDER BY js.openedAt DESC
  `).all(vehicleId);

  for (const js of jobSheets as any[]) {
    js.items = db.prepare('SELECT * FROM job_items WHERE jobSheetId = ?').all(js.id);
    js.expenses = db.prepare('SELECT * FROM expenses WHERE jobSheetId = ?').all(js.id);
  }

  const proformas = db.prepare(`
    SELECT p.*
    FROM proformas p
    WHERE p.vehicleId = ? OR p.jobSheetId IN (SELECT id FROM jobsheets WHERE vehicleId = ?)
    ORDER BY p.createdAt DESC
  `).all(vehicleId, vehicleId);

  const invoices = db.prepare(`
    SELECT i.*
    FROM invoices i
    WHERE i.jobSheetId IN (SELECT id FROM jobsheets WHERE vehicleId = ?)
    ORDER BY i.createdAt DESC
  `).all(vehicleId);

  return {
    vehicle,
    jobSheets,
    proformas,
    invoices
  };
});

export const getCustomerHistory = cache(async (customerId: number) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId) as any;
  if (!customer) return null;

  const vehicles = db.prepare(`
    SELECT v.*, COUNT(js.id) as visitCount
    FROM vehicles v
    LEFT JOIN jobsheets js ON js.vehicleId = v.id AND (js.isDeleted = 0 OR js.isDeleted IS NULL)
    WHERE v.customerId = ? AND (v.isDeleted = 0 OR v.isDeleted IS NULL)
    GROUP BY v.id
    ORDER BY v.plateNumber
  `).all(customerId);

  const jobSheets = db.prepare(`
    SELECT js.*, v.plateNumber as vehiclePlate, v.makeModel as vehicleModel
    FROM jobsheets js LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE js.customerId = ? AND (js.isDeleted = 0 OR js.isDeleted IS NULL)
    ORDER BY js.openedAt DESC
  `).all(customerId);

  const proformas = db.prepare(`
    SELECT p.*, v.plateNumber as vehiclePlate
    FROM proformas p LEFT JOIN vehicles v ON p.vehicleId = v.id
    WHERE p.customerId = ? AND (p.isDeleted = 0 OR p.isDeleted IS NULL)
    ORDER BY p.createdAt DESC
  `).all(customerId);

  const invoices = db.prepare(`
    SELECT i.*, v.plateNumber as vehiclePlate
    FROM invoices i
    LEFT JOIN jobsheets js ON i.jobSheetId = js.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE i.customerId = ? AND (i.isDeleted = 0 OR i.isDeleted IS NULL)
    ORDER BY i.createdAt DESC
  `).all(customerId);

  return { customer, vehicles, jobSheets, proformas, invoices };
});

export const getTrashItems = cache(async () => {
  const jobSheets = db.prepare(`
    SELECT js.*, 'jobsheet' as itemType, c.name as customerName, v.plateNumber as vehiclePlate 
    FROM jobsheets js
    LEFT JOIN customers c ON js.customerId = c.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE js.isDeleted = 1
    ORDER BY js.deletedAt DESC
  `).all();

  const proformas = db.prepare(`
    SELECT p.*, 'proforma' as itemType, c.name as customerName
    FROM proformas p
    LEFT JOIN customers c ON p.customerId = c.id
    WHERE p.isDeleted = 1
    ORDER BY p.deletedAt DESC
  `).all();

  const invoices = db.prepare(`
    SELECT i.*, 'invoice' as itemType, c.name as customerName
    FROM invoices i
    LEFT JOIN customers c ON i.customerId = c.id
    WHERE i.isDeleted = 1
    ORDER BY i.deletedAt DESC
  `).all();

  const customers = db.prepare("SELECT *, 'customer' as itemType FROM customers WHERE isDeleted = 1 ORDER BY deletedAt DESC").all();
  const vehicles = db.prepare("SELECT v.*, 'vehicle' as itemType, c.name as customerName FROM vehicles v LEFT JOIN customers c ON v.customerId = c.id WHERE v.isDeleted = 1 ORDER BY v.deletedAt DESC").all();
  const expenses = db.prepare("SELECT *, 'expense' as itemType FROM expenses WHERE isDeleted = 1 ORDER BY deletedAt DESC").all();
  const documents = db.prepare("SELECT d.*, 'document' as itemType, c.name as customerName FROM documents d LEFT JOIN customers c ON d.customerId = c.id WHERE d.isDeleted = 1 ORDER BY d.deletedAt DESC").all();

  return {
    jobSheets,
    proformas,
    invoices,
    customers,
    vehicles,
    expenses,
    documents,
    totalCount: jobSheets.length + proformas.length + invoices.length + customers.length + vehicles.length + expenses.length + documents.length
  };
});

export async function restoreItem(itemType: string, id: number) {
  const allowedTables: Record<string, string> = {
    jobsheet: 'jobsheets',
    proforma: 'proformas',
    invoice: 'invoices',
    customer: 'customers',
    vehicle: 'vehicles',
    expense: 'expenses',
    document: 'documents'
  };

  const tableName = allowedTables[itemType];
  if (tableName) {
    db.prepare(`UPDATE ${tableName} SET isDeleted = 0, deletedAt = NULL WHERE id = ?`).run(id);
    revalidatePath('/dashboard/trash');
    revalidatePath('/dashboard/jobsheets');
    revalidatePath('/dashboard/proformas');
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard/vehicles');
    revalidatePath('/dashboard/expenses');
    revalidatePath('/dashboard/documents');
  }
}

export async function permanentlyDeleteItem(itemType: string, id: number) {
  const allowedTables: Record<string, string> = {
    jobsheet: 'jobsheets',
    proforma: 'proformas',
    invoice: 'invoices',
    customer: 'customers',
    vehicle: 'vehicles',
    expense: 'expenses',
    document: 'documents'
  };

  const tableName = allowedTables[itemType];
  if (tableName) {
    db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
    revalidatePath('/dashboard/trash');
  }
}

export async function emptyTrash() {
  const tables = ['jobsheets', 'proformas', 'invoices', 'customers', 'vehicles', 'expenses', 'documents'];
  tables.forEach(t => {
    db.prepare(`DELETE FROM ${t} WHERE isDeleted = 1`).run();
  });
  revalidatePath('/dashboard/trash');
}

export const globalSearch = cache(async (query: string) => {
  if (!query || query.trim().length === 0) {
    return { jobSheets: [], proformas: [], invoices: [], customers: [], vehicles: [], documents: [] };
  }

  const q = `%${query.trim()}%`;

  const jobSheets = db.prepare(`
    SELECT js.*, c.name as customerName, v.plateNumber as vehiclePlate 
    FROM jobsheets js
    LEFT JOIN customers c ON js.customerId = c.id
    LEFT JOIN vehicles v ON js.vehicleId = v.id
    WHERE (js.isDeleted = 0 OR js.isDeleted IS NULL)
      AND (js.jobNo LIKE ? OR js.complaint LIKE ? OR c.name LIKE ? OR v.plateNumber LIKE ?)
    LIMIT 6
  `).all(q, q, q, q);

  const proformas = db.prepare(`
    SELECT p.*, c.name as customerName, v.plateNumber as vehiclePlate
    FROM proformas p
    LEFT JOIN customers c ON p.customerId = c.id
    LEFT JOIN vehicles v ON p.vehicleId = v.id
    WHERE (p.isDeleted = 0 OR p.isDeleted IS NULL)
      AND (p.proformaNo LIKE ? OR c.name LIKE ? OR v.plateNumber LIKE ?)
    LIMIT 6
  `).all(q, q, q);

  const invoices = db.prepare(`
    SELECT i.*, c.name as customerName, js.jobNo
    FROM invoices i
    LEFT JOIN customers c ON i.customerId = c.id
    LEFT JOIN jobsheets js ON i.jobSheetId = js.id
    WHERE (i.isDeleted = 0 OR i.isDeleted IS NULL)
      AND (i.invoiceNo LIKE ? OR c.name LIKE ? OR js.jobNo LIKE ?)
    LIMIT 6
  `).all(q, q, q);

  const customers = db.prepare(`
    SELECT * FROM customers 
    WHERE (isDeleted = 0 OR isDeleted IS NULL)
      AND (name LIKE ? OR phone LIKE ? OR tin LIKE ?)
    LIMIT 6
  `).all(q, q, q);

  const vehicles = db.prepare(`
    SELECT v.*, c.name as customerName 
    FROM vehicles v
    LEFT JOIN customers c ON v.customerId = c.id
    WHERE (v.isDeleted = 0 OR v.isDeleted IS NULL)
      AND (v.plateNumber LIKE ? OR v.makeModel LIKE ? OR c.name LIKE ?)
    LIMIT 6
  `).all(q, q, q);

  const documents = db.prepare(`
    SELECT d.*, c.name as customerName 
    FROM documents d
    LEFT JOIN customers c ON d.customerId = c.id
    WHERE (d.isDeleted = 0 OR d.isDeleted IS NULL)
      AND (d.docNo LIKE ? OR d.title LIKE ? OR c.name LIKE ?)
    LIMIT 6
  `).all(q, q, q);

  return {
    jobSheets,
    proformas,
    invoices,
    customers,
    vehicles,
    documents
  };
});



