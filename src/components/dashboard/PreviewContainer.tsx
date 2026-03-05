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
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-800 no-print">
      {/* Toolbar */}
      <div className="flex h-14 w-full items-center justify-between border-b border-white/10 bg-zinc-900 px-4 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-sm font-bold tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="h-9 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white text-xs"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={onPrint} 
            className="h-9 bg-[#c10d12] text-white hover:bg-[#a00b0f] text-xs font-bold"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="ml-2 h-9 w-9 text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-auto preview-scroll bg-zinc-800/50 p-8 flex justify-center">
        <div className="print-container">
          {children}
        </div>
      </div>
    </div>
  );
}
