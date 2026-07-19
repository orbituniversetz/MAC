'use client'

import { cn } from '@/lib/utils';
import { Wrench, ShieldCheck, User } from 'lucide-react';
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
      className={cn("a4-page font-sans shadow-lg", className)}
    >
      {/* Header - Avoid Break */}
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

      {/* Banner - Avoid Break */}
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

      {/* Info Grid - Avoid Break */}
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

      {/* Tables removed per user request - Job Card is now an intake receipt */}
      <div className="flex-1 flex flex-col justify-center items-center py-20 border-2 border-dashed border-zinc-100 rounded-3xl mb-8 avoid-break">
        <Wrench className="h-12 w-12 text-zinc-100 mb-4" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs text-center px-12 leading-relaxed">
          Vehicle Intake confirmed. Full technical findings and repair items will be provided in the Technical Report and Proforma Invoice.
        </p>
      </div>

      {/* Footer - Avoid Break */}
      <div className="mt-auto pt-8 border-t border-zinc-100 shrink-0 avoid-break">
        <div className="grid grid-cols-2 gap-12">
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Terms and Conditions</h3>
            <div className="text-[9px] text-zinc-500 whitespace-pre-wrap italic leading-relaxed font-bold">
              {settings.garage_terms || 'Standard mechanical repair conditions apply.'}
            </div>
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
            <p className="text-[10px] text-center text-zinc-900 uppercase font-black tracking-widest">
              Authorized Signature & Seal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}