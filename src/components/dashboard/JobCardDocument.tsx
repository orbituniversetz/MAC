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
      <div className="flex-grow">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center">
            {settings.garage_logo && (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image 
                  src={settings.garage_logo} 
                  alt="Garage Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
            )}
          </div>
          <div className="text-right space-y-0">
            <h1 className="text-xl font-black text-[#c10d12] uppercase leading-tight tracking-tight">{settings.garage_name}</h1>
            <div className="text-[9px] text-gray-600 font-bold flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 border-b-2 border-gray-900 pb-1">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">
            {isInternal ? 'Internal Garage Copy' : 'CUSTOMER COPY – VEHICLE RECEIPT'}
          </h2>
          <div className="text-right text-[10px] font-bold">
            <p>Job No: <span className="text-[#c10d12]">{job.jobNo}</span></p>
            <p className="text-gray-500 font-normal">Date Received: {new Date(job.openedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="space-y-2">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer Information</h3>
              <p className="font-bold text-sm">{job.customerName}</p>
              <p className="text-xs">{job.customerPhone}</p>
              <p className="text-[10px] text-muted-foreground">{job.customerAddress || 'No address provided'}</p>
              {job.customerTin && <p className="text-[9px] font-bold mt-0.5">TIN: {job.customerTin}</p>}
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Vehicle Information</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-black text-gray-900 uppercase">{job.vehiclePlate}</p>
                  <p className="text-xs font-medium text-gray-600">{job.vehicleModel}</p>
                </div>
                <Wrench className="h-6 w-6 text-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Section */}
        <div className="mb-4">
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Complaint / Service Request</h3>
          <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg min-h-[40px] bg-white italic text-xs text-gray-700 leading-relaxed">
            {job.complaint || 'No complaint recorded.'}
          </div>
        </div>

        {isInternal && job.mechanicNotes && (
          <div className="mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Mechanic Notes / Internal Observations</h3>
            <p className="text-xs text-blue-900 leading-relaxed">{job.mechanicNotes}</p>
          </div>
        )}

        {/* Items Table - Only visible on Internal Copy */}
        {isInternal && (
          <div className="mb-6">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">
              Detailed Parts & Labour Costs
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900 bg-gray-50">
                  <th className="py-1.5 text-left text-[9px] font-black uppercase w-8 px-2">#</th>
                  <th className="py-1.5 text-left text-[9px] font-black uppercase px-2">Description</th>
                  <th className="py-1.5 text-center text-[9px] font-black uppercase w-20 px-2">Type</th>
                  <th className="py-1.5 text-center text-[9px] font-black uppercase w-16 px-2">Qty</th>
                  <th className="py-1.5 text-right text-[9px] font-black uppercase w-24 px-2">Unit Price</th>
                  <th className="py-1.5 text-right text-[9px] font-black uppercase w-24 px-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {job.items.length > 0 ? (
                  job.items.map((item: any, index: number) => (
                    <tr key={item.id} className="text-[10px]">
                      <td className="py-2 text-gray-400 px-2">{index + 1}</td>
                      <td className="py-2 font-bold px-2">{item.description}</td>
                      <td className="py-2 text-center px-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[8px] font-black text-gray-500 uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2 text-center font-bold px-2">{item.qty}</td>
                      <td className="py-2 text-right px-2 whitespace-nowrap">{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2 text-right font-black px-2 whitespace-nowrap">{item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-10">
                    <td colSpan={6} className="py-2 text-center text-gray-300 italic text-[10px]">No items recorded.</td>
                  </tr>
                )}
              </tbody>
              {job.items.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-900 bg-gray-50">
                    <td colSpan={5} className="py-2 text-right font-black uppercase text-[9px] px-2">Estimated Job Total (Income):</td>
                    <td className="py-2 text-right font-black text-[#c10d12] text-xs px-2 whitespace-nowrap">TZS {total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {!isInternal && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Terms and Conditions</h3>
            <div className="text-[8px] text-gray-600 whitespace-pre-wrap italic leading-relaxed">
              {settings.garage_terms || 'No terms and conditions defined.'}
            </div>
          </div>
        )}
      </div>

      {/* Signatures - Fixed to bottom of content area */}
      <div className="mt-8 pt-4 grid grid-cols-2 gap-20 signature-block">
        <div className="space-y-4">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              {isInternal ? 'Mechanic/Supervisor' : 'Garage Representative'}
            </p>
            <p className="text-[10px] font-bold mt-0.5 uppercase">{settings.garage_name}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              {isInternal ? 'Admin Approval' : 'Customer Signature'}
            </p>
            <p className="text-[8px] text-gray-500 mt-0.5 italic leading-tight">
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