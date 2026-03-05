'use client'

import { Wrench } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProformaDocumentProps {
  proforma: any;
  settings: any;
  className?: string;
}

export function ProformaDocument({ proforma, settings, className }: ProformaDocumentProps) {
  const subtotal = proforma.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const discount = proforma.discount || 0;
  
  const taxEnabled = proforma.taxEnabled === 1;
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;
  const totalPaid = proforma.totalPaid || 0;
  const balanceDue = Math.max(0, total - totalPaid);
  const isFullyPaid = balanceDue <= 0;

  return (
    <div id="proforma-document" className={className}>
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
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">PROFORMA INVOICE</h2>
          <div className="text-right text-[10px] font-bold">
            <p>Proforma No: <span className="text-[#c10d12]">{proforma.proformaNo}</span></p>
            <p className="text-gray-500 font-normal">Date: {new Date(proforma.createdAt).toLocaleDateString()}</p>
            {proforma.jobNo && <p className="text-gray-500 font-normal">Reference: {proforma.jobNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
            <div className="space-y-0.5">
              <p className="font-bold text-sm">{proforma.customerName}</p>
              <p className="text-[10px]">{proforma.customerAddress || 'No Address Provided'}</p>
              <p className="text-[10px]">TIN: {proforma.customerTin || 'N/A'}</p>
              <p className="text-[10px]">Tel: {proforma.customerPhone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-bold text-gray-500 uppercase text-[9px]">Registration:</span> {proforma.vehiclePlate || 'N/A'}</p>
              <p><span className="font-bold text-gray-500 uppercase text-[9px]">Make/Model:</span> {proforma.vehicleModel || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-[#c10d12] text-white">
              <th className="p-2 text-left text-[10px] font-bold uppercase w-10">No.</th>
              <th className="p-2 text-left text-[10px] font-bold uppercase">Description</th>
              <th className="p-2 text-center text-[10px] font-bold uppercase w-16">Qty</th>
              <th className="p-2 text-right text-[10px] font-bold uppercase w-32">Unit Price</th>
              <th className="p-2 text-right text-[10px] font-bold uppercase w-32">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {proforma.items.map((item: any, index: number) => (
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
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center mb-2">
              <span className="font-bold text-xs uppercase">Grand Total:</span>
              <span className="font-black text-xl text-[#c10d12] whitespace-nowrap">TZS {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-2 text-green-700 font-bold border-t border-dashed border-gray-300">
              <span>Paid to Date:</span>
              <span className="whitespace-nowrap">{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-700 font-black pt-1">
              <span>BALANCE DUE:</span>
              <span className="whitespace-nowrap font-black">TZS {balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-xl mb-8 flex justify-between items-center",
          isFullyPaid ? "bg-green-600 text-white" : "bg-zinc-900 text-white"
        )}>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Payment Status</p>
            <h4 className="text-lg font-bold">{isFullyPaid ? 'FULLY PAID' : 'PENDING PAYMENT'}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium opacity-70 uppercase">Outstanding Balance</p>
            <p className="text-2xl font-black whitespace-nowrap">TZS {balanceDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bank Details</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Bank:</span> {settings.bank_name}</p>
              <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Account Name:</span> {settings.bank_account_name}</p>
              <p><span className="font-bold text-gray-500 w-24 inline-block uppercase text-[9px]">Account No:</span> {settings.bank_account_number}</p>
            </div>
          </div>
          <div className="text-[9px] text-gray-500 italic leading-relaxed">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 not-italic">Payment Terms</h3>
            <p>Payment is due upon approval of this invoice. Listed services include mechanical repairs and parts as detailed. Additional discoveries during servicing will be communicated before proceeding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}