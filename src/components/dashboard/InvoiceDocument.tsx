'use client'

import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';

interface InvoiceDocumentProps {
  invoice: any;
  settings: any;
  className?: string;
}

export function InvoiceDocument({ invoice, settings, className }: InvoiceDocumentProps) {
  const snapshot = invoice.snapshot || {};
  const subtotal = snapshot.items?.reduce((acc: number, item: any) => acc + item.subtotal, 0) || 0;
  const discount = snapshot.discount || 0;
  
  const taxEnabled = snapshot.taxEnabled === 1;
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;

  return (
    <div id="invoice-document" className={cn("a4-page font-sans", className)}>
      {/* Header - Logo Left, Text Right */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-zinc-100 pb-4">
        <div className="flex items-center">
          {settings.garage_logo ? (
            <div className="relative h-20 w-20 overflow-hidden shrink-0">
              <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="h-20 w-20 bg-zinc-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-10 w-10 text-zinc-200" />
            </div>
          )}
        </div>
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">
            {settings.garage_name}
          </h1>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex flex-col items-end">
            <span>{settings.garage_mailbox}</span>
            <span>{settings.garage_address}</span>
            <span className="text-zinc-800 font-black">Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-zinc-950 text-white p-4 rounded shadow-sm">
        <h2 className="text-xl font-black uppercase tracking-tighter">TAX INVOICE</h2>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70 leading-none">INVOICE NUMBER</p>
          <p className="text-xl font-black leading-none">{invoice.invoiceNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-8">
        <div>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Customer Billing Info</h3>
          <div className="space-y-1">
            <p className="font-black text-lg text-zinc-900 leading-tight">{invoice.customerName}</p>
            <p className="text-sm font-bold text-zinc-600">{invoice.customerAddress || 'No Address Registered'}</p>
            <p className="text-xs font-black bg-zinc-100 px-2 py-0.5 rounded-full inline-block mt-1">TIN: {invoice.customerTin || 'N/A'}</p>
            <p className="text-sm font-bold text-zinc-600">Tel: {invoice.customerPhone}</p>
          </div>
        </div>
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest w-24 inline-block">Registration:</span> <span className="font-black text-zinc-900">{invoice.vehiclePlate || 'N/A'}</span></p>
            <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest w-24 inline-block">Make/Model:</span> <span className="font-bold text-zinc-700">{invoice.vehicleModel || 'N/A'}</span></p>
            <p className="pt-2 border-t border-zinc-200 mt-2 font-black text-zinc-500 text-[10px] uppercase tracking-widest">
              Job Ref: {invoice.jobNo || 'General'} | Date: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-zinc-900 text-white">
            <th className="p-3 text-left text-[10px] font-black uppercase">Service / Part Description</th>
            <th className="p-3 text-center text-[10px] font-black uppercase w-16">Qty</th>
            <th className="p-3 text-right text-[10px] font-black uppercase w-32">Unit Price</th>
            <th className="p-3 text-right text-[10px] font-black uppercase w-32">Total (TZS)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 font-bold">
          {snapshot.items?.map((item: any) => (
            <tr key={item.id} className="text-xs">
              <td className="p-4 font-black text-zinc-900 uppercase tracking-tight">{item.description}</td>
              <td className="p-4 text-center text-zinc-800">{item.qty}</td>
              <td className="p-4 text-right whitespace-nowrap text-zinc-600">{item.unitPrice.toLocaleString()}</td>
              <td className="p-4 text-right font-black whitespace-nowrap text-zinc-900">TZS {item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-72 space-y-2 bg-zinc-50 p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
            <span className="text-zinc-500">Subtotal:</span>
            <span className="text-zinc-900 whitespace-nowrap">{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-red-600">
              <span className="text-zinc-500">Discount:</span>
              <span className="whitespace-nowrap">({discount.toLocaleString()})</span>
            </div>
          )}
          {taxEnabled && (
            <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
              <span className="text-zinc-500">VAT (18%):</span>
              <span className="text-zinc-900 whitespace-nowrap">{taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-4 border-t-2 border-zinc-200 flex justify-between items-center">
            <span className="font-black text-xs uppercase tracking-widest">Grand Total:</span>
            <span className="font-black text-2xl text-[#c10d12] whitespace-nowrap tracking-tighter">TZS {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t-4 border-zinc-950">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Payment Instructions</h3>
            <div className="space-y-2 text-xs">
              <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Bank:</span> <span className="font-black text-zinc-900">{settings.bank_name}</span></p>
              <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account Name:</span> <span className="font-bold text-zinc-700">{settings.bank_account_name}</span></p>
              <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account No:</span> <span className="font-black text-zinc-900">{settings.bank_account_number}</span></p>
              <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">SWIFT Code:</span> <span className="font-bold text-zinc-700">{settings.bank_swift}</span></p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] font-black mb-6 uppercase tracking-widest text-zinc-400">Authorized Signature & Seal</p>
            <div className="h-12 border-b-2 border-zinc-900 w-48 ml-auto mb-2 opacity-20"></div>
            <p className="text-[10px] text-zinc-900 uppercase font-black tracking-widest">{settings.garage_name} Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}