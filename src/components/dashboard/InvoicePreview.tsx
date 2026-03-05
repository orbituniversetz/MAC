'use client'

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X, ZoomIn, ZoomOut, Maximize, Receipt } from 'lucide-react';
import { InvoiceDocument } from './InvoiceDocument';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  invoice: any;
  settings: any;
}

export function InvoicePreview({ invoice, settings }: InvoicePreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-document');
    if (!element) return;

    // Scale 2.0 + JPEG 0.75 is the sweet spot for sharpness vs < 500KB size
    const canvas = await html2canvas(element, {
      scale: 2.0,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.75);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`INVOICE ${invoice.invoiceNo}.pdf`);
  };

  if (!mounted) {
    return (
      <Button className="bg-[#c10d12]">
        <Printer className="mr-2 h-4 w-4" /> Print Invoice
      </Button>
    );
  }

  const zoomStyles = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center'
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c10d12]" onClick={() => setIsOpen(true)}>
          <Printer className="mr-2 h-4 w-4" /> Preview & Print
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none bg-gray-500 overflow-hidden flex flex-col border-none">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between z-50 shadow-sm no-print text-black">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-[#c10d12]" />
              Invoice Preview - {invoice.invoiceNo}
            </DialogTitle>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setZoom(100)} title="Reset Zoom">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="outline" className="border-gray-300">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={handlePrint} className="bg-[#c10d12] hover:bg-[#a00b0f] text-white">
              <Printer className="mr-2 h-4 w-4" /> Print Now
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-600/50 scrollbar-hide">
          <div style={zoomStyles} className="transition-transform duration-200">
            <InvoiceDocument invoice={invoice} settings={settings} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
