'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { InvoiceDocument } from './InvoiceDocument';
import { PreviewContainer } from './PreviewContainer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  invoice: any;
  settings: any;
}

export function InvoicePreview({ invoice, settings }: InvoicePreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-document');
    if (!element) return;

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

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`INVOICE-${invoice.invoiceNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Button className="bg-[#c10d12] hover:bg-[#a00b0f]" onClick={() => setIsOpen(true)}>
        <Receipt className="mr-2 h-4 w-4" /> Preview & Print
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`Invoice Preview - ${invoice.invoiceNo}`}
          onClose={() => setIsOpen(false)}
          onPrint={handlePrint}
          onDownload={handleDownloadPDF}
          icon={<Receipt className="h-5 w-5 text-[#c10d12]" />}
        >
          <InvoiceDocument invoice={invoice} settings={settings} />
        </PreviewContainer>
      )}
    </>
  );
}
