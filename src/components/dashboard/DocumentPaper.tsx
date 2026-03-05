'use client'

import { FileText, Mail } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DocumentPaperProps {
  doc: any;
  settings: any;
  className?: string;
}

export function DocumentPaper({ doc, settings, className }: DocumentPaperProps) {
  return (
    <div id="document-paper" className={cn("bg-zinc-800 p-1 shadow-2xl rounded-sm", className)}>
      <div className="a4-page text-black font-sans bg-white mx-auto">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-2 border-b-2 border-zinc-100 pb-4">
          <div className="flex items-center">
            {settings.garage_logo ? (
              <div className="relative h-24 w-24 overflow-hidden shrink-0">
                <Image 
                  src={settings.garage_logo} 
                  alt="Garage Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
            ) : (
              <div className="h-24 w-24 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-200">
                {doc.docType === 'LETTER' ? <Mail className="h-12 w-12" /> : <FileText className="h-12 w-12" />}
              </div>
            )}
          </div>
          <div className="text-right flex flex-col justify-center">
            <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">{settings.garage_name}</h1>
            <div className="text-[10px] text-zinc-500 font-bold leading-tight uppercase tracking-tight">
              <p>{settings.garage_mailbox}</p>
              <p>{settings.garage_address}</p>
              <p className="text-zinc-800 font-black">Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10 border-b-4 border-zinc-900 pb-2">
          <div className="inline-flex items-center gap-2 bg-zinc-950 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest">
            {doc.docType === 'LETTER' ? <Mail className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
            {doc.docType === 'LETTER' ? 'Official Correspondence' : 'Technical Inspection Report'}
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">REFERENCE NO.</p>
            <p className="font-black text-xl tracking-tighter leading-none">{doc.docNo}</p>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">{new Date(doc.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="mb-12 space-y-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Recipient Address</p>
            <p className="font-black text-lg text-zinc-900 leading-tight">{doc.customerName}</p>
            <p className="text-sm font-bold text-zinc-600 leading-snug">{doc.customerAddress || 'No Address Provided'}</p>
            {doc.customerPhone && <p className="text-sm font-black text-zinc-800">TEL: {doc.customerPhone}</p>}
          </div>

          {doc.vehiclePlate && (
            <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-100 inline-block min-w-[400px] shadow-sm">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Subject Vehicle Reference</p>
              <p className="text-lg font-black tracking-tight text-zinc-900">{doc.vehiclePlate} <span className="text-zinc-400 font-bold ml-2">({doc.vehicleModel})</span></p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase border-b-8 border-zinc-950 inline-block pb-1 tracking-tighter text-zinc-900">
            {doc.title}
          </h2>
        </div>

        <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-zinc-800 leading-relaxed text-base flex-1 mb-12">
          {doc.content}
        </div>

        <div className="mt-12 space-y-12 signature-block">
          <p className="text-base font-bold">Yours faithfully,</p>
          <div className="space-y-2">
            <div className="w-72 border-b-4 border-zinc-900 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest text-zinc-900">{settings.garage_name} Management</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">AUTHORIZED SIGNATORY</p>
          </div>
        </div>
      </div>
    </div>
  );
}