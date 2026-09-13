'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface ExportPDFButtonProps {
  targetId: string;
  filename: string;
}

export function ExportPDFButton({ targetId, filename }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Could not find the document to export."
      });
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Find all the .a4-page elements in the container
      const pages = element.querySelectorAll('.a4-page');

      if (pages.length === 0) {
        // Fallback to capturing the whole container if there are no pages
        const canvas = await html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: element.offsetWidth,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width, undefined, 'FAST');
      } else {
        let addedPagesCount = 0;
        for (let i = 0; i < pages.length; i++) {
          const pageEl = pages[i] as HTMLElement;

          // Skip completely blank pages
          if (!pageEl.innerText || pageEl.innerText.trim() === '') {
            continue;
          }

          const canvas = await html2canvas(pageEl, {
            scale: 2.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: pageEl.offsetWidth,
            height: pageEl.offsetHeight,
            onclone: (clonedDoc) => {
              const clonedPages = clonedDoc.querySelectorAll('.a4-page');
              clonedPages.forEach((page: any) => {
                page.style.boxShadow = 'none';
                page.style.border = 'none';
                page.style.margin = '0';
              });
            }
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          if (addedPagesCount > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          addedPagesCount++;
        }
      }

      pdf.save(`${filename}.pdf`);
      
      toast({
        title: "Professional PDF Exported",
        description: "Document generated with high-fidelity pagination."
      });
    } catch (error) {
      console.error('PDF Error:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate professional A4 PDF."
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={isExporting}
      className="border-[#c10d12]/20 text-[#c10d12] hover:bg-red-50 font-bold"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? 'Processing...' : 'Download A4 PDF'}
    </Button>
  );
}
