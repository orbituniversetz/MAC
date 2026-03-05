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
  
  // Conditionally calculate VAT based on snapshot setting
  const taxEnabled = snapshot.taxEnabled === 1;
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;

  return (
    <div id="invoice-document" className={`a4-page print-container text-black font-sans flex flex-col ${className || ''}`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-1">TAX INVOICE</h2>
            <div className="text-xs font-bold space-y-0.5">
              <p>No: <span className="text-[#c10d12]">{invoice.invoiceNo}</span></p>
              <p className="text-gray-500 font-normal">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              {invoice.jobNo && <p className="text-gray-500 font-normal">Ref: {invoice.jobNo}</p>}
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            {settings.garage_logo ? (
              <div className="relative h-28 w-28 mb-3">
                <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="h-16 w-16 bg-[#c10d12] rounded flex items-center justify-center mb-3">
                <Wrench className="text-white h-8 w-8" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none mb-1">
                {settings.garage_name}
              </h1>
              <div className="text-[11px] font-medium text-gray-600 space-y-0.5">
                <p>{settings.garage_mailbox}</p>
                <p>{settings.garage_address}</p>
                <p>Tel: {settings.garage_phone}</p>
                <p className="font-bold text-gray-900 mt-1 uppercase">TIN: {settings.garage_tin}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-gray-900 mb-6" />

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
            <div className="space-y-0.5">
              <p className="font-bold text-sm">{invoice.customerName}</p>
              <p className="text-[10px]">{invoice.customerAddress || 'No Address Provided'}</p>
              <p className="text-[10px]">TIN: {invoice.customerTin || 'N/A'}</p>
              <p className="text-[10px]">Tel: {invoice.customerPhone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
            <div className="space-y-0.5 text-[10px]">
              <p><span className="font-bold">Registration:</span> {invoice.vehiclePlate || 'N/A'}</p>
              <p><span className="font-bold">Make/Model:</span> {invoice.vehicleModel || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 text-left text-[9px] font-bold uppercase w-8">No.</th>
              <th className="p-2 text-left text-[9px] font-bold uppercase">Description</th>
              <th className="p-2 text-center text-[9px] font-bold uppercase w-16">Qty</th>
              <th className="p-2 text-right text-[9px] font-bold uppercase w-28">Unit Price</th>
              <th className="p-2 text-right text-[9px] font-bold uppercase w-28">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {snapshot.items?.map((item: any, index: number) => (
              <tr key={item.id} className="text-[10px]">
                <td className="p-2 text-center text-gray-400">{index + 1}</td>
                <td className="p-2 font-medium">{item.description}</td>
                <td className="p-2 text-center">{item.qty}</td>
                <td className="p-2 text-right">{item.unitPrice.toLocaleString()}</td>
                <td className="p-2 text-right font-bold">{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-56 space-y-1.5 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-medium">{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Discount:</span>
                <span className="font-medium">({discount.toLocaleString()})</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">VAT (18%):</span>
                <span className="font-medium">{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-[11px]">GRAND TOTAL:</span>
              <span className="font-black text-lg text-[#c10d12]">TZS {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bank Details for Payment</h3>
            <div className="space-y-0.5 text-[9px]">
              <p><span className="font-bold text-gray-600 w-24 inline-block">Bank:</span> {settings.bank_name}</p>
              <p><span className="font-bold text-gray-600 w-24 inline-block">Branch:</span> {settings.bank_branch}</p>
              <p><span className="font-bold text-gray-600 w-24 inline-block">Account:</span> {settings.bank_account_name}</p>
              <p><span className="font-bold text-gray-600 w-24 inline-block">Number:</span> {settings.bank_account_number}</p>
              <p><span className="font-bold text-gray-600 w-24 inline-block">SWIFT:</span> {settings.bank_swift}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold mb-1">Authorized Signature</p>
            <div className="h-12 border-b border-gray-300 w-48 ml-auto"></div>
            <p className="text-[8px] text-gray-400 mt-1 uppercase">{settings.garage_name} Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
