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
  forceSinglePage?: boolean;
}

export function ExportPDFButton({ targetId, filename, forceSinglePage = false }: ExportPDFButtonProps) {
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
      // Configuration for professional typeset A4
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const canvas = await html2canvas(element, {
        scale: 2.5, // Enterprise resolution for crisp fonts
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(targetId);
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.width = '210mm';
            clonedElement.style.minHeight = 'auto';
            // Ensure background is visible
            clonedElement.style.background = 'white';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      let imgWidthInPdf = pdfWidth;
      let imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;

      // Handle Single Page Scaling
      if (forceSinglePage && imgHeightInPdf > pdfHeight) {
        const ratio = pdfHeight / imgHeightInPdf;
        imgHeightInPdf = pdfHeight;
        imgWidthInPdf = pdfWidth * ratio;
      }

      const xOffset = (pdfWidth - imgWidthInPdf) / 2;
      let heightLeft = imgHeightInPdf;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
      
      if (!forceSinglePage) {
        heightLeft -= pdfHeight;
        // Logic for professional pagination: slicing with standard A4 blocks
        while (heightLeft > 2) {
          position = heightLeft - imgHeightInPdf; 
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      
      toast({
        title: "Professional PDF Generated",
        description: "Document successfully exported with high-fidelity pagination."
      });
    } catch (error) {
      console.error('PDF Error:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred during high-fidelity PDF generation."
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
      className="border-[#c10d12]/20 text-[#c10d12] hover:bg-red-50"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? 'Generating...' : 'Download A4 PDF'}
    </Button>
  );
}