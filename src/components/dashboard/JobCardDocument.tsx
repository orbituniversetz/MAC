'use client'

import { cn } from '@/lib/utils';
import { Wrench, ShieldCheck, User, FileText } from 'lucide-react';
import Image from 'next/image';

interface JobCardDocumentProps {
  job: any;
  settings: any;
  isInternal?: boolean;
  className?: string;
}

export function JobCardDocument({ job, settings, isInternal = false, className }: JobCardDocumentProps) {
  return (
    <div 
      id={isInternal ? "jobcard-document-internal" : "jobcard-document-customer"} 
      className={cn("space-y-8 print:space-y-0", className)}
    >
      {/* PAGE 1: INTAKE RECEIPT */}
      <div className="a4-page font-sans relative flex flex-col shadow-lg print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b-2 border-zinc-100 pb-4 shrink-0 avoid-break">
          <div className="flex items-center">
            {settings.garage_logo ? (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="h-20 w-20 bg-zinc-50 rounded-lg flex items-center justify-center">
                 <Wrench className="h-10 w-10 text-zinc-200" />
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

        {/* Banner */}
        <div className="flex justify-between items-center mb-8 bg-zinc-950 text-white p-4 rounded shadow-sm shrink-0 avoid-break">
          <div className="inline-flex items-center gap-2">
            {isInternal ? <ShieldCheck className="h-4 w-4 text-blue-400" /> : <User className="h-4 w-4 text-red-400" />}
            <h2 className="text-lg font-bold uppercase tracking-widest">{isInternal ? 'INTERNAL JOB RECORD' : 'VEHICLE JOB CARD'}</h2>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70 leading-none">REFERENCE NO.</p>
            <p className="text-xl font-black leading-none">{job.jobNo}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-8 avoid-break">
          <div>
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Customer Information</h3>
            <div className="space-y-1">
              <p className="font-black text-lg text-zinc-900 leading-tight">{job.customerName}</p>
              <p className="text-sm font-bold text-zinc-600 leading-snug">{job.customerAddress || 'No Address Provided'}</p>
              <div className="flex flex-col gap-1 mt-2">
                  {job.customerPhone && <p className="text-xs font-black text-zinc-800">TEL: {job.customerPhone}</p>}
                  {job.customerTin && <p className="text-xs font-black bg-zinc-100 px-2 py-0.5 rounded-full w-fit">TIN: {job.customerTin}</p>}
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 flex flex-col justify-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
            <p className="text-lg font-black tracking-tight text-zinc-900">{job.vehiclePlate} <span className="text-zinc-400 font-bold ml-2">({job.vehicleModel})</span></p>
            <div className="pt-2 border-t border-zinc-200 mt-2">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Work Requested / Complaint</p>
              <p className="text-xs text-zinc-800 italic leading-snug font-bold">"{job.complaint || 'General repair and mechanical inspection.'}"</p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-zinc-100 rounded-3xl mb-8 avoid-break">
          <Wrench className="h-12 w-12 text-zinc-50 mb-4" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] text-center px-12 leading-relaxed">
            Vehicle Intake confirmed. Full technical findings and repair items will be provided in the Technical Report and Proforma Invoice.
          </p>
        </div>

        {/* Signatures for Page 1 */}
        <div className="mt-auto pt-8 border-t border-zinc-100 avoid-break">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Acknowledgment</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">By signing this document, the customer authorizes the garage to perform the requested inspection and repairs as per the terms on Page 2.</p>
            </div>
            <div className="flex flex-col justify-end space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center space-y-2">
                  <div className="h-10 border-b-2 border-zinc-300 opacity-50"></div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Supervisor / Rep</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-10 border-b-2 border-zinc-300 opacity-50"></div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer Authorization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: TERMS AND CONDITIONS */}
      <div className="a4-page font-sans relative flex flex-col shadow-lg print:shadow-none break-before-page">
        <div className="flex items-center justify-between mb-8 border-b-2 border-zinc-900 pb-4 avoid-break">
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#c10d12]" />
            Document Terms & Conditions
          </h2>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">REFERENCE</p>
            <p className="text-xs font-black text-zinc-900">{job.jobNo}</p>
          </div>
        </div>

        <div className="p-8 bg-zinc-50 rounded-3xl border-2 border-zinc-100 shadow-sm min-h-[200mm] avoid-break">
          <h3 className="text-xs font-black text-[#c10d12] uppercase tracking-widest mb-6 border-b border-red-100 pb-2">Job Sheet Terms (Customer Copy)</h3>
          <div className="text-xs text-zinc-700 whitespace-pre-wrap leading-loose font-medium">
            {settings.garage_terms || 'Standard mechanical repair conditions apply. All work is guaranteed as per the workshop policy.'}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-4 border-zinc-950 flex justify-between items-center avoid-break">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
            <p>{settings.garage_name}</p>
            <p>Official Document - Page 2 of 2</p>
          </div>
          <div className="h-16 w-16 opacity-10">
             <Wrench className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
