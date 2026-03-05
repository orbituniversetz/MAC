'use client'

import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    <div id="invoice-document" className={className}>
      <div className="a4-page text-black font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div className="flex items-center">
            {settings.garage_logo && (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
              </div>
            )}
          </div>
          <div className="text-right space-y-0.5">
            <h1 className="text-xl font-black text-[#c10d12] uppercase leading-none tracking-tight">
              {settings.garage_name}
            </h1>
            <div className="text-[9px] font-bold text-gray-600 flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 border-b-2 border-gray-900 pb-1">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">TAX INVOICE</h2>
          <div className="text-right text-[10px] font-bold">
            <p>Invoice No: <span className="text-[#c10d12]">{invoice.invoiceNo}</span></p>
            <p className="text-gray-500 font-normal">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            {invoice.jobNo && <p className="text-gray-500 font-normal">Job Ref: {invoice.jobNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
            <div className="space-y-0.5">
              <p className="font-bold text-sm">{invoice.customerName}</p>
              <p className="text-[10px]">{invoice.customerAddress || 'No Address Provided'}</p>
              <p className="text-[10px]">TIN: {invoice.customerTin || 'N/A'}</p>
              <p className="text-[10px]">Tel: {invoice.customerPhone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-bold text-gray-500 uppercase text-[9px]">Registration:</span> {invoice.vehiclePlate || 'N/A'}</p>
              <p><span className="font-bold text-gray-500 uppercase text-[9px]">Make/Model:</span> {invoice.vehicleModel || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 text-left text-[10px] font-bold uppercase w-10">No.</th>
              <th className="p-2 text-left text-[10px] font-bold uppercase">Description</th>
              <th className="p-2 text-center text-[10px] font-bold uppercase w-16">Qty</th>
              <th className="p-2 text-right text-[10px] font-bold uppercase w-32">Unit Price</th>
              <th className="p-2 text-right text-[10px] font-bold uppercase w-32">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {snapshot.items?.map((item: any, index: number) => (
              <tr key={item.id} className="text-xs">
                <td className="p-2.5 text-center text-gray-400">{index + 1}</td>
                <td className="p-2.5 font-bold">{item.description}</td>
                <td className="p-2.5 text-center">{item.qty}</td>
                <td className="p-2.5 text-right whitespace-nowrap">{item.unitPrice.toLocaleString()}</td>
                <td className="p-2.5 text-right font-black whitespace-nowrap">TZS {item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-1.5 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-medium whitespace-nowrap">{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-red-600">
                <span className="text-gray-500">Discount:</span>
                <span className="font-medium whitespace-nowrap">({discount.toLocaleString()})</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">VAT (18%):</span>
                <span className="font-medium whitespace-nowrap">{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-xs uppercase">Grand Total:</span>
              <span className="font-black text-xl text-[#c10d12] whitespace-nowrap">TZS {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bank Details for Payment</h3>
              <div className="space-y-1 text-xs">
                <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Bank:</span> {settings.bank_name}</p>
                <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Account Name:</span> {settings.bank_account_name}</p>
                <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Account No:</span> {settings.bank_account_number}</p>
                <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">SWIFT Code:</span> {settings.bank_swift}</p>
              </div>
            </div>
            <div className="text-right signature-block">
              <p className="text-[10px] font-bold mb-4 uppercase tracking-widest text-gray-400">Authorized Signature</p>
              <div className="h-12 border-b border-gray-300 w-48 ml-auto"></div>
              <p className="text-[9px] text-gray-400 mt-2 uppercase font-black">{settings.garage_name} Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
