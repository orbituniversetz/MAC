'use client'

import { Wrench } from 'lucide-react';
import Image from 'next/image';

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
    <div id="proforma-document" className={`a4-page print-container text-black font-sans flex flex-col ${className || ''}`}>
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
              {settings.garage_name || 'M. A. C. GARAGE'}
            </h1>
            <div className="text-[9px] font-bold text-gray-600 flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 border-b-2 border-gray-900 pb-1">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">PROFORMA INVOICE</h2>
          <div className="text-right text-[10px] font-bold">
            <p>No: <span className="text-[#c10d12]">{proforma.proformaNo}</span></p>
            <p className="text-gray-500 font-normal">Date: {new Date(proforma.createdAt).toLocaleDateString()}</p>
            {proforma.jobNo && <p className="text-gray-500 font-normal">Ref: {proforma.jobNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bill To</h3>
            <div className="space-y-0.5">
              <p className="font-bold text-sm">{proforma.customerName}</p>
              <p className="text-[10px]">{proforma.customerAddress || 'No Address Provided'}</p>
              <p className="text-[10px]">TIN: {proforma.customerTin || 'N/A'}</p>
              <p className="text-[10px]">Tel: {proforma.customerPhone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vehicle Details</h3>
            <div className="space-y-0.5 text-[10px]">
              <p><span className="font-bold">Registration:</span> {proforma.vehiclePlate || 'N/A'}</p>
              <p><span className="font-bold">Make/Model:</span> {proforma.vehicleModel || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-4 border-collapse">
          <thead>
            <tr className="bg-[#c10d12] text-white">
              <th className="p-1.5 text-left text-[9px] font-bold uppercase w-8">No.</th>
              <th className="p-1.5 text-left text-[9px] font-bold uppercase">Description</th>
              <th className="p-1.5 text-center text-[9px] font-bold uppercase w-12">Qty</th>
              <th className="p-1.5 text-right text-[9px] font-bold uppercase w-24">Unit Price</th>
              <th className="p-1.5 text-right text-[9px] font-bold uppercase w-24">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {proforma.items.map((item: any, index: number) => (
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
            <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center mb-1">
              <span className="font-bold text-[10px]">GRAND TOTAL:</span>
              <span className="font-black text-sm text-[#c10d12] whitespace-nowrap">TZS {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[9px] pt-1 text-green-700 font-bold border-t border-dashed border-gray-300">
              <span>Paid to Date:</span>
              <span className="whitespace-nowrap">{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-red-700 font-black pt-0.5">
              <span>BALANCE DUE:</span>
              <span className="whitespace-nowrap">TZS {balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg mb-4 flex justify-between items-center ${isFullyPaid ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}>
          <div>
            <p className="text-[7px] font-black uppercase tracking-widest opacity-70">Payment Status</p>
            <h4 className="text-sm font-bold">{isFullyPaid ? 'Fully Paid' : 'Pending Payment'}</h4>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-medium opacity-70">Remaining Balance</p>
            <p className="text-lg font-black whitespace-nowrap">TZS {balanceDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <div className="grid grid-cols-2 gap-8 border-t pt-3">
          <div>
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bank Details</h3>
            <div className="space-y-0 text-[9px]">
              <p><span className="font-bold text-gray-600 w-20 inline-block">Bank:</span> {settings.bank_name}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Branch:</span> {settings.bank_branch}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Account:</span> {settings.bank_account_name}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">Number:</span> {settings.bank_account_number}</p>
              <p><span className="font-bold text-gray-600 w-20 inline-block">SWIFT:</span> {settings.bank_swift}</p>
            </div>
          </div>
          <div className="text-[8px] text-gray-500 italic leading-relaxed">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 not-italic">Payment Terms</h3>
            <p>Payment is due upon approval of this invoice. Listed services include mechanical repairs and parts as detailed. Additional discoveries during servicing will be communicated before proceeding. Vehicles not collected within 48 hours may attract storage charges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}