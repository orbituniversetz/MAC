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
    <div className="fixed inset-0 z-[9999] flex flex-col bg-zinc-900/90 backdrop-blur-sm no-print">
      {/* Toolbar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-zinc-950 px-6 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            {icon}
          </div>
          <h2 className="text-sm font-bold tracking-tight uppercase tracking-widest">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-bold"
          >
            <Download className="mr-2 h-4 w-4" />
            SAVE AS PDF
          </Button>
          <Button 
            onClick={onPrint} 
            className="h-10 bg-[#c10d12] text-white hover:bg-[#a00b0f] text-xs font-black shadow-lg shadow-red-900/40"
          >
            <Printer className="mr-2 h-4 w-4" />
            PRINT DOCUMENT
          </Button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-auto preview-scroll py-12 px-4 flex justify-center bg-zinc-900">
        <div className="print-container relative">
          {children}
        </div>
      </div>
    </div>
  );
}