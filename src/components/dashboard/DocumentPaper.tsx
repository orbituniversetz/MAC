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
    <div id="document-paper" className={className}>
      <div className="a4-page text-black font-sans bg-white">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-4 border-b pb-4">
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
          <div className="text-right space-y-0.5">
            <h1 className="text-xl font-black text-[#c10d12] uppercase leading-tight tracking-tight">{settings.garage_name}</h1>
            <div className="text-[9px] text-gray-600 font-bold flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-900 pb-1">
          <div className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tight">
            {doc.docType === 'LETTER' ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
            {doc.docType === 'LETTER' ? 'Official Letter' : 'Technical Report'}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg tracking-tighter leading-none">{doc.docNo}</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{new Date(doc.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-10 space-y-6">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">To:</p>
            <p className="font-bold text-base">{doc.customerName}</p>
            <p className="text-sm">{doc.customerAddress || 'No Address Provided'}</p>
            {doc.customerPhone && <p className="text-sm">Tel: {doc.customerPhone}</p>}
          </div>

          {doc.vehiclePlate && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block min-w-[350px]">
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1.5">Vehicle Reference</p>
              <p className="text-base font-bold tracking-tight">{doc.vehiclePlate} ({doc.vehicleModel})</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black inline-block pb-1 tracking-tighter">
            {doc.title}
          </h2>
        </div>

        <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-zinc-800 leading-relaxed text-base flex-1">
          {doc.content}
        </div>

        <div className="mt-12 space-y-10 signature-block">
          <p className="text-base">Yours sincerely,</p>
          <div className="space-y-2">
            <div className="w-64 border-b-2 border-gray-400" />
            <p className="text-sm font-bold uppercase tracking-widest">{settings.garage_name} Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}