'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

  const zoomLevels = [80, 100, 120];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-800 no-print">
      {/* Toolbar */}
      <div className="flex h-14 w-full items-center justify-between border-b border-white/10 bg-zinc-900 px-4 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-sm font-bold tracking-tight">{title}</h2>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10" 
              onClick={() => setZoom(prev => Math.max(50, prev - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-7 px-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10">
                  {zoom}%
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-zinc-900 border-zinc-700 text-white">
                {zoomLevels.map(level => (
                  <DropdownMenuItem 
                    key={level} 
                    onClick={() => setZoom(level)}
                    className="text-xs hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    {level}%
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  onClick={() => setZoom(100)}
                  className="text-xs hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  Fit to width
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10" 
              onClick={() => setZoom(prev => Math.min(200, prev + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10" 
              onClick={() => setZoom(100)}
            >
              <Maximize className="h-4 w-4" />
            </Button>
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
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }} 
          className="transition-transform duration-200"
        >
          <div className="print-container">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
