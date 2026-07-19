'use client'

import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import Image from 'next/image';

interface ProformaDocumentProps {
  proforma: any;
  settings: any;
  className?: string;
}

export function ProformaDocument({ proforma, settings, className }: ProformaDocumentProps) {
  const subtotal = proforma.items?.reduce((acc: number, item: any) => acc + item.subtotal, 0) || 0;
  const discount = proforma.discount || 0;
  
  const taxEnabled = proforma.taxEnabled !== 0;
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;
  const totalPaid = proforma.totalPaid || 0;
  const balanceDue = Math.max(0, total - totalPaid);
  const isFullyPaid = balanceDue <= 0;

  return (
    <div id="proforma-document" className={cn("a4-page font-sans", className)}>
      {/* Header - Logo Left, Text Right */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-zinc-100 pb-4 shrink-0 avoid-break">
        <div className="flex items-center">
          {settings.garage_logo ? (
            <div className="relative h-20 w-20 overflow-hidden shrink-0">
              <Image 
                src={settings.garage_logo} 
                alt="Logo" 
                fill 
                className="object-contain" 
                unoptimized 
              />
            </div>
          ) : (
            <div className="h-20 w-20 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-200">
              <FileText className="h-10 w-10" />
            </div>
          )}
        </div>
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">{settings.garage_name}</h1>
          <div className="text-[10px] text-zinc-500 font-bold leading-tight uppercase tracking-tight flex flex-col items-end">
            <p>{settings.garage_mailbox}</p>
            <p>{settings.garage_address}</p>
            <p className="text-zinc-800 font-black">Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-zinc-950 text-white p-4 rounded shadow-sm shrink-0 avoid-break">
        <h2 className="text-lg font-bold uppercase tracking-widest">PROFORMA INVOICE</h2>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70 leading-none">QUOTATION NUMBER</p>
          <p className="text-xl font-black leading-none">{proforma.proformaNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-8 shrink-0 avoid-break">
        <div>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Quotation For</h3>
          <div className="space-y-1">
            <p className="font-black text-lg text-zinc-900 leading-tight">{proforma.customerName}</p>
            <p className="text-sm font-bold text-zinc-600 leading-snug">{proforma.customerAddress || 'No Address Provided'}</p>
            <div className="flex flex-col gap-1 mt-2">
                {proforma.customerPhone && <p className="text-xs font-black text-zinc-800">TEL: {proforma.customerPhone}</p>}
                {proforma.customerTin && <p className="text-xs font-black bg-zinc-100 px-2 py-0.5 rounded-full w-fit">TIN: {proforma.customerTin}</p>}
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
          <p className="text-lg font-black tracking-tight text-zinc-900">{proforma.vehiclePlate} <span className="text-zinc-400 font-bold ml-2">({proforma.vehicleModel})</span></p>
          {proforma.jobNo && (
            <div className="pt-2 border-t border-zinc-200 mt-2">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Reference Job Sheet</p>
              <p className="text-xs text-zinc-800 font-bold">{proforma.jobNo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Table - Supports Pagination Slicing */}
      <div className="flex-1 mb-12">
        <table className="w-full border-collapse">
          <thead className="table-header-group">
            <tr className="bg-zinc-950 text-white">
              <th className="p-3 text-left text-[10px] font-black uppercase">Service / Part Description</th>
              <th className="p-3 text-center text-[10px] font-black uppercase w-16">Qty</th>
              <th className="p-3 text-right text-[10px] font-black uppercase w-32">Unit Price</th>
              <th className="p-3 text-right text-[10px] font-black uppercase w-32">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {proforma.items?.map((item: any) => (
              <tr key={item.id} className="text-xs">
                <td className="p-4 font-black text-zinc-900 uppercase tracking-tight">{item.description}</td>
                <td className="p-4 text-center font-bold">{item.qty}</td>
                <td className="p-4 text-right whitespace-nowrap text-zinc-600">{item.unitPrice.toLocaleString()}</td>
                <td className="p-4 text-right font-black whitespace-nowrap text-zinc-900">TZS {item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Financial Block - Keep Together */}
      <div className="mt-auto space-y-6 shrink-0 avoid-break pt-8 border-t-2 border-zinc-50">
        <div className="flex justify-end">
          <div className="w-72 space-y-2 bg-zinc-50 p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <div className="flex justify-between text-xs font-black uppercase tracking-tight">
              <span className="text-zinc-500">Subtotal:</span>
              <span className="text-zinc-900">{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs font-black uppercase tracking-tight text-red-600">
                <span className="text-zinc-500">Discount:</span>
                <span>({discount.toLocaleString()})</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                <span className="text-zinc-500">VAT (18%):</span>
                <span className="text-zinc-900">{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-4 border-t-2 border-zinc-200 flex justify-between items-center mb-2">
              <span className="font-black text-xs uppercase tracking-widest">Grand Total:</span>
              <span className="font-black text-2xl text-[#c10d12] tracking-tighter">TZS {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-2 text-green-700 font-black border-t border-dashed border-zinc-300">
              <span>PAID TO DATE:</span>
              <span>{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-700 font-black">
              <span>BALANCE DUE:</span>
              <span>TZS {balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl flex justify-between items-center border-2 bg-zinc-950 text-white shadow-md">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Current Payment Status</p>
            <h4 className="text-xl font-black tracking-tight">{isFullyPaid ? 'FULLY SETTLED' : 'PENDING PAYMENT'}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-tighter">Outstanding Balance</p>
            <p className="text-3xl font-black tracking-tighter">TZS {balanceDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-8 border-t-4 border-zinc-950">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Banking Instructions</h3>
              <div className="space-y-1.5 text-xs">
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Bank:</span> <span className="font-black text-zinc-900">{settings.bank_name}</span></p>
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account Name:</span> <span className="font-bold text-zinc-700">{settings.bank_account_name}</span></p>
                <p><span className="font-black text-zinc-400 uppercase text-[9px] w-28 inline-block tracking-widest">Account No:</span> <span className="font-black text-zinc-900">{settings.bank_account_number}</span></p>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 italic leading-relaxed font-bold">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 not-italic">Quotation Terms</h3>
              <p>Payment must be completed before the vehicle is released unless otherwise agreed in writing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}