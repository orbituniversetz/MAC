'use client';

import React, { useState } from 'react';
import { Printer, Download, X, ZoomIn, ZoomOut } from 'lucide-react';
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
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const scale = zoom / 100;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-zinc-950 no-print">
      {/* Toolbar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-zinc-900 px-6 text-white shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            {icon}
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold tracking-tight uppercase tracking-widest leading-none">{title}</h2>
            <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">
              Standard A4 View
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg border border-white/5 mx-4">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out" className="h-8 w-8 text-white/70 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <button 
            onClick={handleResetZoom}
            className="px-2 text-[10px] font-bold min-w-[45px] hover:text-[#c10d12] transition-colors"
            title="Reset Zoom"
          >
            {zoom}%
          </button>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In" className="h-8 w-8 text-white/70 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-bold hidden sm:flex"
          >
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button 
            onClick={onPrint} 
            className="h-10 bg-[#c10d12] text-white hover:bg-[#a00b0f] text-xs font-black shadow-lg shadow-red-900/40"
          >
            <Printer className="mr-2 h-4 w-4" />
            PRINT
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
      <div className="flex-1 overflow-auto preview-scroll bg-zinc-900/80 p-4 sm:p-12">
        <div 
          className="mx-auto shadow-2xl transition-transform duration-200 origin-top bg-white print-container"
          style={{ 
            transform: `scale(${scale})`,
            width: '210mm',
            // Increase height buffer based on scale to prevent cutting off the bottom
            marginBottom: `${Math.max(0, (scale - 1) * 100)}%`
          }}
        >
          {children}
        </div>
        {/* Generous spacer to ensure we can always scroll to the bottom of long scaled documents */}
        <div style={{ height: '1500px' }} className="w-full shrink-0" />
      </div>
    </div>
  );
}
