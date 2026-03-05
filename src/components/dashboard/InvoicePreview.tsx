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
import { Printer, Download, X, ZoomIn, ZoomOut, Maximize, Receipt, ZapOff } from 'lucide-react';
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

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`INVOICE ${invoice.invoiceNo}.pdf`);
  };

  if (!mounted) {
    return (
      <Button className="bg-[#c10d12]">
        <Printer className="mr-2 h-4 w-4" /> Print Invoice
      </Button>
    );
  }

  const isPerformanceMode = settings.performance_mode === 'true';
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
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between z-50 shadow-sm no-print">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-[#c10d12]" />
              Invoice Preview - {invoice.invoiceNo}
            </DialogTitle>
            {!isPerformanceMode && (
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
            )}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={handlePrint} className="bg-[#c10d12] hover:bg-[#a00b0f]">
              <Printer className="mr-2 h-4 w-4" /> Print Now
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-600/50 scrollbar-hide">
          {isPerformanceMode ? (
            <div className="bg-white p-12 rounded-xl shadow-2xl max-w-lg w-full h-fit mt-20 flex flex-col items-center text-center space-y-6">
              <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center">
                <ZapOff className="h-10 w-10 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black">Ready for Export</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Visual preview is hidden to maximize performance for your PC. 
                  Your Tax Invoice is generated and ready for download or printing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <Button onClick={handleDownloadPDF} variant="outline" className="h-14 font-bold">
                  <Download className="mr-2 h-4 w-4" /> Save PDF
                </Button>
                <Button onClick={handlePrint} className="bg-black text-white hover:bg-gray-800 h-14 font-bold">
                  <Printer className="mr-2 h-4 w-4" /> Print Now
                </Button>
              </div>
              {/* Hidden element for PDF generation */}
              <div className="sr-only">
                <InvoiceDocument invoice={invoice} settings={settings} />
              </div>
            </div>
          ) : (
            <div style={zoomStyles} className="transition-transform duration-200">
              <InvoiceDocument invoice={invoice} settings={settings} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}