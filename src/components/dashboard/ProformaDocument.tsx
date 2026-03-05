'use client'

import { FileText } from 'lucide-react';
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
    <div id="proforma-document" className={cn("bg-zinc-800 p-1 shadow-2xl rounded-sm", className)}>
      <div className="a4-page text-black font-sans bg-white mx-auto">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-2 border-b-2 border-zinc-100 pb-4">
          <div className="flex items-center">
            {settings.garage_logo ? (
              <div className="relative h-24 w-24 overflow-hidden shrink-0">
                <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="h-24 w-24 bg-zinc-50 rounded-lg flex items-center justify-center">
                <FileText className="h-12 w-12 text-zinc-200" />
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

        <div className="flex justify-between items-center mb-8 bg-[#c10d12] text-white p-4 rounded-md">
          <h2 className="text-lg font-black uppercase tracking-widest">PROFORMA INVOICE</h2>
          <div className="text-right">
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter leading-none">QUOTATION NUMBER</p>
            <p className="text-xl font-black leading-none">{proforma.proformaNo}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Quotation For</h3>
            <div className="space-y-1">
              <p className="font-black text-lg text-zinc-900 leading-tight">{proforma.customerName}</p>
              <p className="text-sm font-bold text-zinc-600">{proforma.customerAddress || 'No Address Provided'}</p>
              <p className="text-xs font-black text-zinc-800">TIN: {proforma.customerTin || 'N/A'}</p>
              <p className="text-sm font-bold text-zinc-600">Tel: {proforma.customerPhone}</p>
            </div>
          </div>
          <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-100 flex flex-col justify-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
            <div className="space-y-1">
              <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest">Plate Number:</span> <span className="font-black text-zinc-900">{proforma.vehiclePlate || 'N/A'}</span></p>
              <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest">Make / Model:</span> <span className="font-bold text-zinc-700">{proforma.vehicleModel || 'N/A'}</span></p>
              {proforma.jobNo && <p className="mt-2 text-[10px] font-black bg-white border px-2 py-0.5 rounded-full inline-block">Ref Job: {proforma.jobNo}</p>}
            </div>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-white">
              <th className="p-3 text-left text-[10px] font-black uppercase w-10">No.</th>
              <th className="p-3 text-left text-[10px] font-black uppercase">Description</th>
              <th className="p-3 text-center text-[10px] font-black uppercase w-16">Qty</th>
              <th className="p-3 text-right text-[10px] font-black uppercase w-32">Unit Price</th>
              <th className="p-3 text-right text-[10px] font-black uppercase w-32">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-zinc-100">
            {proforma.items.map((item: any, index: number) => (
              <tr key={item.id} className="text-xs group hover:bg-zinc-50">
                <td className="p-3.5 text-center text-zinc-400 font-bold">{index + 1}</td>
                <td className="p-3.5 font-black text-zinc-900 uppercase tracking-tight">{item.description}</td>
                <td className="p-3.5 text-center font-bold">{item.qty}</td>
                <td className="p-3.5 text-right font-medium whitespace-nowrap text-zinc-600">{item.unitPrice.toLocaleString()}</td>
                <td className="p-3.5 text-right font-black whitespace-nowrap text-zinc-900">TZS {item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-10">
          <div className="w-72 space-y-2 bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-100 shadow-sm">
            <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
              <span className="text-zinc-500">Subtotal:</span>
              <span className="whitespace-nowrap text-zinc-900">{subtotal.toLocaleString()}</span>
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
                <span className="whitespace-nowrap text-zinc-900">{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-4 border-t-2 border-zinc-200 flex justify-between items-center mb-2">
              <span className="font-black text-xs uppercase tracking-widest">Grand Total:</span>
              <span className="font-black text-2xl text-[#c10d12] whitespace-nowrap tracking-tighter">TZS {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-3 text-green-700 font-black border-t border-dashed border-zinc-300">
              <span>PAID TO DATE:</span>
              <span className="whitespace-nowrap">{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-700 font-black pt-1">
              <span>BALANCE DUE:</span>
              <span className="whitespace-nowrap font-black">TZS {balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-2xl mb-10 flex justify-between items-center border-2",
          isFullyPaid ? "bg-green-600 border-green-700 text-white shadow-lg" : "bg-zinc-900 border-zinc-950 text-white shadow-xl"
        )}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Current Payment Status</p>
            <h4 className="text-xl font-black tracking-tight">{isFullyPaid ? 'FULLY SETTLED' : 'PENDING PAYMENT'}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Outstanding Balance</p>
            <p className="text-3xl font-black whitespace-nowrap tracking-tighter">TZS {balanceDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-auto pt-10 border-t-2 border-zinc-100">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Banking Instructions</h3>
              <div className="space-y-1.5 text-xs">
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Bank:</span> <span className="font-black text-zinc-900">{settings.bank_name}</span></p>
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account Name:</span> <span className="font-bold text-zinc-700">{settings.bank_account_name}</span></p>
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account No:</span> <span className="font-black text-zinc-900">{settings.bank_account_number}</span></p>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 italic leading-relaxed font-medium">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 not-italic">Quotation Terms</h3>
              <p>This quotation is valid for 30 days. Prices are subject to market changes. Any additional work discovered during service will be quoted separately. Management approval is required before proceeding with any repair.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}