'use client';

import React, { useState } from 'react';
import { Printer, Download, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface PreviewContainerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  documentId: string;
  filename: string;
}

export function PreviewContainer({ 
  title, 
  onClose, 
  children,
  icon,
  documentId,
  filename
}: PreviewContainerProps) {
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById(documentId);
    if (!element) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
      let heightLeft = imgHeightInPdf;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Multi-page logic with threshold to avoid blank/tiny sliver pages
      while (heightLeft > 2) { // 2mm threshold: ignore tiny amounts of white space at bottom
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`${filename}.pdf`);
      toast({ title: "Export Success", description: "Document saved as PDF." });
    } catch (error) {
      console.error('PDF Error:', error);
      toast({ variant: "destructive", title: "Export Failed", description: "Check logs." });
    } finally {
      setIsExporting(false);
    }
  };

  const scale = zoom / 100;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-zinc-950 no-print">
      {/* Dynamic Toolbar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-zinc-900 px-6 text-white shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            {icon}
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold tracking-tight uppercase tracking-widest leading-none">{title}</h2>
            <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">A4 Export Protocol v2.0</p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg border border-white/5 mx-4">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 text-white/70 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <button onClick={handleResetZoom} className="px-2 text-[10px] font-bold min-w-[45px] hover:text-primary transition-colors">
            {zoom}%
          </button>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 text-white/70 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isExporting}
            variant="outline" 
            className="h-10 border-white/20 bg-white/5 text-white text-xs font-bold hidden sm:flex hover:bg-white/10"
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            EXPORT PDF
          </Button>
          <Button onClick={handlePrint} className="h-10 bg-primary text-white hover:bg-red-700 text-xs font-bold">
            <Printer className="mr-2 h-4 w-4" /> PRINT
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-white/50 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Optimized Scroll Viewport */}
      <div className="flex-1 overflow-auto preview-scroll bg-zinc-900/95 flex justify-center p-4 sm:p-12">
        <div 
          className="relative transition-transform duration-200 origin-top print-container shadow-2xl"
          style={{ 
            transform: `scale(${scale})`,
            width: '210mm',
            height: 'fit-content',
            paddingBottom: '40mm', 
            marginBottom: `${Math.max(40, (scale - 1) * 2000)}px`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
