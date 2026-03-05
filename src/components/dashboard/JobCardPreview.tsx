'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck } from 'lucide-react';
import { JobCardDocument } from './JobCardDocument';
import { PreviewContainer } from './PreviewContainer';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInternal = mode === 'INTERNAL';
  const docId = `jobcard-document-${isInternal ? 'internal' : 'customer'}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById(docId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2.0,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pxToMm = 210 / (canvas.width / 2); // 2.0 scale factor
    
    const imgHeightInMm = canvas.height * pxToMm;
    let heightLeft = imgHeightInMm;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'JPEG', 0, -position, pdfWidth, imgHeightInMm, undefined, 'FAST');
      heightLeft -= pdfHeight;
      position += pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`JOB CARD ${isInternal ? 'INTERNAL' : 'CUSTOMER'} ${job.jobNo}.pdf`);
  };

  if (!mounted) return null;

  return (
    <>
      <Button 
        variant={isInternal ? "outline" : "default"} 
        className={!isInternal ? "bg-[#c10d12] hover:bg-[#a00b0f]" : "border-gray-300"} 
        onClick={() => setIsOpen(true)}
      >
        {isInternal ? <ShieldCheck className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
        {isInternal ? 'Garage Internal Copy' : 'Customer Vehicle Receipt'}
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`${isInternal ? 'Internal Management Copy' : 'Customer Receipt'} - ${job.jobNo}`}
          onClose={() => setIsOpen(false)}
          onPrint={handlePrint}
          onDownload={handleDownloadPDF}
          icon={isInternal ? <ShieldCheck className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-[#c10d12]" />}
        >
          <JobCardDocument job={job} settings={settings} isInternal={isInternal} />
        </PreviewContainer>
      )}
    </>
  );
}
