'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ProformaDocument } from './ProformaDocument';
import { PreviewContainer } from './PreviewContainer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProformaPreviewProps {
  proforma: any;
  settings: any;
}

export function ProformaPreview({ proforma, settings }: ProformaPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('proforma-document');
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
    const pxToMm = 210 / (canvas.width / 2);
    
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

    pdf.save(`PROFORMA INVOICE ${proforma.proformaNo}.pdf`);
  };

  if (!mounted) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="mr-2 h-4 w-4" /> Preview Proforma
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`Proforma Preview - ${proforma.proformaNo}`}
          onClose={() => setIsOpen(false)}
          onPrint={handlePrint}
          onDownload={handleDownloadPDF}
          icon={<Eye className="h-5 w-5 text-[#c10d12]" />}
        >
          <ProformaDocument proforma={proforma} settings={settings} />
        </PreviewContainer>
      )}
    </>
  );
}
