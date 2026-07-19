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
      // Create high-fidelity canvas with intelligent multi-page slicing
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(targetId);
          if (!clonedElement) return;

          // Standardize styles for consistent capture
          clonedElement.style.transform = 'none';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.width = '210mm';
          clonedElement.style.background = 'white';
          clonedElement.style.height = 'auto'; 
          
          // Remove UI helpers for clean PDF
          const pages = clonedElement.querySelectorAll('.a4-page');
          pages.forEach((page: any) => {
            page.style.boxShadow = 'none';
            page.style.border = 'none';
            page.style.margin = '0';
          });
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
      
      let heightLeft = imgHeightInPdf;
      let pageNumber = 0;

      // Slice the high-res capture into clean A4 pages
      while (heightLeft > 0) {
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        const position = -(pageNumber * pdfHeight);
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        
        heightLeft -= pdfHeight;
        pageNumber++;
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
