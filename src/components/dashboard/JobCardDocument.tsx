'use client'

import { Wrench } from 'lucide-react';
import Image from 'next/image';

interface JobCardDocumentProps {
  job: any;
  settings: any;
  isInternal?: boolean;
  className?: string;
}

export function JobCardDocument({ job, settings, isInternal = false, className }: JobCardDocumentProps) {
  const total = job.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);

  return (
    <div id={`jobcard-document-${isInternal ? 'internal' : 'customer'}`} className={`a4-page print-container text-black font-sans flex flex-col ${className || ''}`}>
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        {settings.garage_logo && (
          <div className="relative h-48 w-48 mb-4 overflow-hidden shrink-0">
            <Image 
              src={settings.garage_logo} 
              alt="Garage Logo" 
              fill 
              className="object-contain" 
              unoptimized 
            />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#c10d12] uppercase leading-tight">{settings.garage_name}</h1>
          <div className="text-[11px] text-muted-foreground font-medium leading-normal flex flex-wrap justify-center gap-x-4">
            <p>{settings.garage_mailbox}</p>
            <p>{settings.garage_address}</p>
            <p>Tel: {settings.garage_phone}</p>
            <p className="font-bold text-black uppercase">TIN: {settings.garage_tin}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4 border-b-2 border-gray-900 pb-2">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
          {isInternal ? 'Internal Garage Copy' : 'CUSTOMER COPY – VEHICLE RECEIPT'}
        </h2>
        <div className="text-right text-xs font-bold">
          <p>Job No: <span className="text-[#c10d12]">{job.jobNo}</span></p>
          <p className="text-gray-500 font-normal">Date Received: {new Date(job.openedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-2 gap-10 mb-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Information</h3>
            <p className="font-bold text-base">{job.customerName}</p>
            <p className="text-sm">{job.customerPhone}</p>
            <p className="text-xs text-muted-foreground">{job.customerAddress || 'No address provided'}</p>
            {job.customerTin && <p className="text-[10px] font-bold mt-1">TIN: {job.customerTin}</p>}
          </div>
        </div>
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Information</h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xl font-black text-gray-900 uppercase">{job.vehiclePlate}</p>
                <p className="text-sm font-medium text-gray-600">{job.vehicleModel}</p>
              </div>
              <Wrench className="h-8 w-8 text-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Section */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Complaint / Service Request</h3>
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl min-h-[80px] bg-white italic text-sm text-gray-700 leading-relaxed">
          {job.complaint || 'No complaint recorded.'}
        </div>
      </div>

      {isInternal && job.mechanicNotes && (
        <div className="mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Mechanic Notes / Internal Observations</h3>
          <p className="text-sm text-blue-900 leading-relaxed">{job.mechanicNotes}</p>
        </div>
      )}

      {/* Items Table - Only visible on Internal Copy */}
      {isInternal && (
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">
            Detailed Parts & Labour Costs
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 bg-gray-50">
                <th className="py-2 text-left text-[10px] font-black uppercase w-8 px-2">#</th>
                <th className="py-2 text-left text-[10px] font-black uppercase px-2">Description</th>
                <th className="py-2 text-center text-[10px] font-black uppercase w-20 px-2">Type</th>
                <th className="py-2 text-center text-[10px] font-black uppercase w-16 px-2">Qty</th>
                <th className="py-2 text-right text-[10px] font-black uppercase w-24 px-2">Unit Price</th>
                <th className="py-2 text-right text-[10px] font-black uppercase w-24 px-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {job.items.length > 0 ? (
                job.items.map((item: any, index: number) => (
                  <tr key={item.id} className="text-[11px]">
                    <td className="py-3 text-gray-400 px-2">{index + 1}</td>
                    <td className="py-3 font-bold px-2">{item.description}</td>
                    <td className="py-3 text-center px-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-black text-gray-500 uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold px-2">{item.qty}</td>
                    <td className="py-3 text-right px-2">{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-black px-2">{item.subtotal.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="h-10">
                    <td className="py-3 text-gray-300 px-2">{i + 1}</td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                  </tr>
                ))
              )}
            </tbody>
            {job.items.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-900 bg-gray-50">
                  <td colSpan={5} className="py-3 text-right font-black uppercase text-[10px] px-2">Estimated Job Total (Income):</td>
                  <td className="py-3 text-right font-black text-[#c10d12] text-sm px-2">TZS {total.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {!isInternal && (
        <div className="mb-10 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms and Conditions</h3>
          <div className="text-[9px] text-gray-600 whitespace-pre-wrap italic leading-relaxed">
            {settings.garage_terms || 'No terms and conditions defined.'}
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="mt-auto pt-10 grid grid-cols-2 gap-20">
        <div className="space-y-6">
          <div className="border-t border-gray-400 pt-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {isInternal ? 'Mechanic/Supervisor' : 'Garage Representative'}
            </p>
            <p className="text-xs font-bold mt-1 uppercase">{settings.garage_name}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border-t border-gray-400 pt-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {isInternal ? 'Admin Approval' : 'Customer Signature'}
            </p>
            <p className="text-[9px] text-gray-500 mt-1 italic leading-tight">
              {isInternal 
                ? 'I verify the work performed and internal costs recorded above.'
                : 'I authorize the intake of my vehicle and agree to the terms listed above.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}