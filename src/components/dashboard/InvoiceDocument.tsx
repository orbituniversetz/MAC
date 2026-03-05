'use client'

import { Wrench } from 'lucide-react';
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
    <div id="invoice-document" className={`a4-page print-container text-black font-sans flex flex-col ${className || ''}`}>
      <div className="flex-grow">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div className="flex items-center">
            {settings.garage_logo ? (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="h-10 w-10 flex items-center justify-center">
                <Wrench className="text-[#c10d12] h-8 w-8" />
              </div>
            )}
          </div>
          <div className="text-right space-y-0.5">
            <h1 className="text-xl font-black text-[#c10d12] uppercase leading-none mb-1 tracking-tight">
              {settings.garage_name}
            </h1>
            <div className="text-[9px] font-bold text-gray-600 flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 border-b-2 border-gray-900 pb-1">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">TAX INVOICE</h2>
          <div className="text-right text-[10px] font-bold">
            <p>No: <span className="text-[#c10d12]">{invoice.invoiceNo}</span></p>
            <p className="text-gray-500 font-normal">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            {invoice.jobNo && <p className="text-gray-500 font-normal">Ref: {invoice.jobNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Billed To</h3>
            <div className="space-y-0.5">
              <p className="font-bold text-sm">{invoice.customerName}</p>
              <p className="text-[10px]">{invoice.customerAddress || 'No Address Provided'}</p>
              <p className="text-[10px]">TIN: {invoice.customerTin || 'N/A'}</p>
              <p className="text-[10px]">Tel: {invoice.customerPhone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vehicle Details</h3>
            <div className="space-y-0.5 text-[10px]">
              <p><span className="font-bold">Registration:</span> {invoice.vehiclePlate || 'N/A'}</p>
              <p><span className="font-bold">Make/Model:</span> {invoice.vehicleModel || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-4 border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-1.5 text-left text-[9px] font-bold uppercase w-8">No.</th>
              <th className="p-1.5 text-left text-[9px] font-bold uppercase">Description</th>
              <th className="p-1.5 text-center text-[9px] font-bold uppercase w-12">Qty</th>
              <th className="p-1.5 text-right text-[9px] font-bold uppercase w-24">Unit Price</th>
              <th className="p-1.5 text-right text-[9px] font-bold uppercase w-24">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {snapshot.items?.map((item: any, index: number) => (
              <tr key={item.id} className="text-[10px]">
                <td className="p-1.5 text-center text-gray-400">{index + 1}</td>
                <td className="p-1.5 font-medium">{item.description}</td>
                <td className="p-1.5 text-center">{item.qty}</td>
                <td className="p-1.5 text-right whitespace-nowrap">{item.unitPrice.toLocaleString()}</td>
                <td className="p-1.5 text-right font-bold whitespace-nowrap">{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-4">
          <div className="w-52 space-y-1 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-medium whitespace-nowrap">{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Discount:</span>
                <span className="font-medium whitespace-nowrap">({discount.toLocaleString()})</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">VAT (18%):</span>
                <span className="font-medium whitespace-nowrap">{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-[10px]">GRAND TOTAL:</span>
              <span className="font-black text-base text-[#c10d12] whitespace-nowrap">TZS {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t">
        <div className="grid grid-cols-2 gap-8 mb-2">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bank Details for Payment</h3>
            <div className="space-y-0 text-[9px]">
              <p><span className="font-bold text-gray-600 w-20 inline-block">Bank:</span> {settings.bank_name}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Branch:</span> {settings.bank_branch}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Account:</span> {settings.bank_account_name}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Number:</span> {settings.bank_account_number}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">SWIFT:</span> {settings.bank_swift}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold mb-1">Authorized Signature</p>
            <div className="h-8 border-b border-gray-300 w-40 ml-auto"></div>
            <p className="text-[8px] text-gray-400 mt-1 uppercase">{settings.garage_name} Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}