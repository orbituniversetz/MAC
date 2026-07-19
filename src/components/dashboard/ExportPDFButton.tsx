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
      // Configure high-res A4 PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const canvas = await html2canvas(element, {
        scale: 2.5, // Ultra-high fidelity for crisp text
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
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
      let heightLeft = imgHeightInPdf;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Subsequent pages
      while (heightLeft > 5) { // Small threshold to avoid tiny sliver pages
        position = heightLeft - imgHeightInPdf; 
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      
      toast({
        title: "A4 PDF Exported",
        description: "Generated with professional document pagination."
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
      {isExporting ? 'Processing...' : 'Export A4 PDF'}
    </Button>
  );
}
