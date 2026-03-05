'use client';

import React from 'react';
import { Printer, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewContainerProps {
  title: string;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function PreviewContainer({ 
  title, 
  onClose, 
  onPrint, 
  onDownload, 
  children,
  icon
}: PreviewContainerProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-zinc-950 no-print">
      {/* Toolbar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-zinc-900 px-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={onPrint} 
            className="h-10 bg-[#c10d12] text-white hover:bg-[#a00b0f] text-sm font-bold shadow-lg shadow-red-900/20"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="ml-2 h-10 w-10 text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-auto preview-scroll bg-zinc-900/50 p-4 md:p-8 flex justify-center">
        <div className="print-container relative h-fit">
          {children}
        </div>
      </div>
    </div>
  );
}