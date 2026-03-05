'use client'

import { FileText, Mail } from 'lucide-react';
import Image from 'next/image';

interface DocumentPaperProps {
  doc: any;
  settings: any;
  className?: string;
}

export function DocumentPaper({ doc, settings, className }: DocumentPaperProps) {
  return (
    <div id="document-paper" className={`a4-page print-container text-black font-sans flex flex-col ${className || ''}`}>
      <div className="flex-grow">
        {/* Document Header Branding */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
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
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-tight">{settings.garage_name}</h1>
              <div className="text-[10px] text-muted-foreground font-medium leading-normal">
                <p>{settings.garage_mailbox}</p>
                <p>{settings.garage_address}</p>
                <p>Tel: {settings.garage_phone}</p>
                <p className="font-bold text-black mt-1">TIN: {settings.garage_tin}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2">
              {doc.docType === 'LETTER' ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {doc.docType === 'LETTER' ? 'Official Letter' : 'Technical Report'}
            </div>
            <p className="font-bold text-lg leading-none">{doc.docNo}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(doc.createdAt).toLocaleDateString()}</p>
            {doc.jobNo && <p className="text-[9px] font-bold text-gray-400 mt-1">REF: {doc.jobNo}</p>}
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-8" />

        {/* Recipient Section */}
        <div className="mb-10 space-y-4">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">To:</p>
            <p className="font-bold text-base">{doc.customerName}</p>
            <p className="text-sm">{doc.customerAddress || 'No Address Provided'}</p>
            {doc.customerPhone && <p className="text-sm">Tel: {doc.customerPhone}</p>}
          </div>

          {doc.vehiclePlate && (
            <div className="bg-gray-50 p-3 rounded border border-gray-100 inline-block min-w-[300px]">
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Vehicle Reference</p>
              <p className="text-sm font-bold">{doc.vehiclePlate} ({doc.vehicleModel})</p>
            </div>
          )}
        </div>

        {/* Document Subject/Title */}
        <div className="mb-8">
          <h2 className="text-xl font-black uppercase border-b-2 border-black inline-block pb-1">
            {doc.title}
          </h2>
        </div>

        {/* Main Content Body */}
        <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm">
          {doc.content}
        </div>

        {/* Signature Area */}
        <div className="mt-20 space-y-10">
          <p className="text-sm">Yours sincerely,</p>
          <div className="space-y-1">
            <div className="w-48 border-b border-gray-400 pb-1" />
            <p className="text-sm font-bold uppercase">{settings.garage_name} Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
