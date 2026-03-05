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
  const taxRate = parseFloat(settings.tax_rate || '0') / 100;
  const taxAmount = proforma.taxEnabled ? (subtotal - discount) * taxRate : 0;
  const total = subtotal - discount + taxAmount;

  return (
    <div id="proforma-document" className={`a4-page print-container text-black font-sans ${className || ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        {/* Invoice Details */}
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 mb-1">PROFORMA INVOICE</h2>
          <div className="text-xs font-bold space-y-0.5">
            <p>No: <span className="text-[#c10d12]">{proforma.proformaNo}</span></p>
            <p className="text-gray-500 font-normal">Date: {new Date(proforma.createdAt).toLocaleDateString()}</p>
            {proforma.jobNo && <p className="text-gray-500 font-normal">Ref: {proforma.jobNo}</p>}
          </div>
        </div>

        {/* Garage Details (Logo above, larger) */}
        <div className="flex flex-col items-end text-right">
          {settings.garage_logo ? (
            <div className="relative h-24 w-24 mb-3">
              <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="h-20 w-20 bg-[#c10d12] rounded flex items-center justify-center mb-3">
              <Wrench className="text-white h-10 w-10" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-[#c10d12] uppercase leading-none mb-1">
              {settings.garage_name || 'M. A. C. GARAGE'}
            </h1>
            <div className="text-[11px] font-medium text-gray-600 space-y-0.5">
              <p>{settings.garage_mailbox}</p>
              <p>{settings.garage_address}</p>
              <p>Tel: {settings.garage_phone}</p>
              <p className="font-bold text-gray-900 mt-1">TIN: {settings.garage_tin}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gray-100 mb-6" />

      {/* Bill To & Vehicle */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
          <div className="space-y-0.5">
            <p className="font-bold text-sm">{proforma.customerName}</p>
            <p className="text-[10px]">{proforma.customerAddress || 'No Address Provided'}</p>
            <p className="text-[10px]">TIN: {proforma.customerTin || 'N/A'}</p>
            <p className="text-[10px]">Tel: {proforma.customerPhone}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
          <div className="space-y-0.5 text-[10px]">
            <p><span className="font-bold">Registration:</span> {proforma.vehiclePlate || 'N/A'}</p>
            <p><span className="font-bold">Make/Model:</span> {proforma.vehicleModel || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-[#c10d12] text-white">
            <th className="p-2 text-left text-[9px] font-bold uppercase w-8">No.</th>
            <th className="p-2 text-left text-[9px] font-bold uppercase">Description</th>
            <th className="p-2 text-center text-[9px] font-bold uppercase w-16">Qty</th>
            <th className="p-2 text-right text-[9px] font-bold uppercase w-28">Unit Price</th>
            <th className="p-2 text-right text-[9px] font-bold uppercase w-28">Total (TZS)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {proforma.items.map((item: any, index: number) => (
            <tr key={item.id} className="text-[10px]">
              <td className="p-2 text-center text-gray-400">{index + 1}</td>
              <td className="p-2 font-medium">{item.description}</td>
              <td className="p-2 text-center">{item.qty}</td>
              <td className="p-2 text-right">{item.unitPrice.toLocaleString()}</td>
              <td className="p-2 text-right font-bold">{item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
          {proforma.items.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-400 italic text-[10px]">No items added.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end mb-6">
        <div className="w-48 space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Subtotal:</span>
            <span className="font-medium">{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Discount:</span>
            <span className="font-medium">({discount.toLocaleString()})</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">VAT ({settings.tax_rate}%):</span>
            <span className="font-medium">{taxAmount.toLocaleString()}</span>
          </div>
          <div className="pt-1.5 border-t flex justify-between items-center">
            <span className="font-bold text-[11px]">TOTAL:</span>
            <span className="font-black text-sm text-[#c10d12]">TZS {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-gray-900 text-white p-4 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Status Summary</p>
          <h4 className="text-lg font-bold">Pending Payment</h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium text-gray-400">Balance Due</p>
          <p className="text-xl font-black">TZS {total.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="grid grid-cols-2 gap-8 border-t pt-6">
        <div>
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bank Details</h3>
          <div className="space-y-0.5 text-[9px]">
            <p><span className="font-bold text-gray-600 w-24 inline-block">Bank:</span> {settings.bank_name}</p>
            <p><span className="font-bold text-gray-600 w-24 inline-block">Branch:</span> {settings.bank_branch}</p>
            <p><span className="font-bold text-gray-600 w-24 inline-block">Account Name:</span> {settings.bank_account_name}</p>
            <p><span className="font-bold text-gray-600 w-24 inline-block">Account Number:</span> {settings.bank_account_number}</p>
            <p><span className="font-bold text-gray-600 w-24 inline-block">SWIFT:</span> {settings.bank_swift}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Terms & Agreement</h3>
          <div className="text-[8px] text-gray-500 space-y-1 italic leading-relaxed">
            <p>Payment is due upon approval of this invoice unless otherwise agreed between both parties. The listed services include mechanical repairs, bodywork, painting, and parts replacements as detailed above. Any additional repairs discovered during servicing will be communicated before proceeding. Vehicle release conditions depend on payment agreement. Payments must be made via bank transfer using the details above.</p>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-12 text-center border-t pt-3">
        <p className="text-[8px] text-gray-400 font-medium italic">Computer generated document. Valid without signature.</p>
      </div>
    </div>
  );
}