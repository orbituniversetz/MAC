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
import { Eye, Printer, Download, X, ZoomIn, ZoomOut, Maximize, Wrench, User, ShieldCheck } from 'lucide-react';
import { JobCardDocument } from './JobCardDocument';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface JobCardPreviewProps {
  job: any;
  settings: any;
  mode: 'CUSTOMER' | 'INTERNAL';
}

export function JobCardPreview({ job, settings, mode }: JobCardPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const isInternal = mode === 'INTERNAL';

  const handleDownloadPDF = async () => {
    const docId = `jobcard-document-${isInternal ? 'internal' : 'customer'}`;
    const element = document.getElementById(docId);
    if (!element) return;

    // Optimized canvas for smaller file size
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Using JPEG at 0.75 quality for massive file size savings
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
    pdf.save(`JOB CARD ${isInternal ? 'INTERNAL' : 'CUSTOMER'} ${job.jobNo}.pdf`);
  };

  if (!mounted) {
    return (
      <Button variant={isInternal ? "outline" : "default"} className={!isInternal ? "bg-[#c10d12]" : ""}>
        {isInternal ? <ShieldCheck className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
        Preview {isInternal ? 'Internal' : 'Customer'} Copy
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
        <Button variant={isInternal ? "outline" : "default"} className={!isInternal ? "bg-[#c10d12] hover:bg-[#a00b0f]" : "border-gray-300"} onClick={() => setIsOpen(true)}>
          {isInternal ? <ShieldCheck className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
          {isInternal ? 'Garage Internal Copy' : 'Customer Vehicle Receipt'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none bg-gray-500 overflow-hidden flex flex-col border-none">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between z-50 shadow-sm no-print">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-black">
              {isInternal ? <ShieldCheck className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-[#c10d12]" />}
              {isInternal ? 'Internal Management Copy' : 'Customer Receipt'} - {job.jobNo}
            </DialogTitle>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono w-12 text-center text-black">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setZoom(100)} title="Reset Zoom" className="text-black">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="outline" className="border-gray-300">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={handlePrint} className="bg-[#c10d12] hover:bg-[#a00b0f] text-white">
              <Printer className="mr-2 h-4 w-4" /> Print Document
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-600/50 scrollbar-hide">
          <div style={zoomStyles} className="transition-transform duration-200">
            <JobCardDocument job={job} settings={settings} isInternal={isInternal} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
