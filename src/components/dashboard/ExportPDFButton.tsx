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
      
      // Smart Multi-Page Paginator
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(targetId);
          if (!clonedElement) return;

          // Apply pagination awareness to the cloned DOM
          const pageHeightPx = (297 / 25.4) * 96 * 2.5; // Roughly 1122px at 96dpi scaled by 2.5
          // However, simpler to work with normalized units
          const a4HeightPx = clonedElement.offsetWidth * (297 / 210);
          
          clonedElement.style.transform = 'none';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.width = '210mm';
          clonedElement.style.background = 'white';

          // 1. Identify all critical "keep together" sections
          const sections = clonedElement.querySelectorAll('.avoid-break');
          sections.forEach((section: any) => {
            const rect = section.getBoundingClientRect();
            const top = section.offsetTop;
            const bottom = top + rect.height;
            
            const pageNum = Math.floor(top / a4HeightPx);
            const pageEnd = (pageNum + 1) * a4HeightPx;
            
            // If it straddles a page break, push it down
            if (bottom > pageEnd - 20) { // 20px safety margin
              const pushAmount = pageEnd - top + 40; // Push to next page with margin
              section.style.marginTop = `${pushAmount}px`;
            }
          });

          // 2. Identify and paginate table rows strictly
          const tables = clonedElement.querySelectorAll('table');
          tables.forEach((table: any) => {
            const rows = table.querySelectorAll('tbody tr');
            const thead = table.querySelector('thead');
            
            rows.forEach((row: any) => {
              const rect = row.getBoundingClientRect();
              const top = row.offsetTop;
              const bottom = top + rect.height;
              
              const pageNum = Math.floor(top / a4HeightPx);
              const pageEnd = (pageNum + 1) * a4HeightPx;
              
              if (bottom > pageEnd - 40) {
                const pushAmount = pageEnd - top + 20;
                row.style.borderTop = `${pushAmount}px solid white`; // Visible gap in canvas
                
                // If header repetition is needed, we'd need to insert a DOM node here.
                // For bitmap slicing, header repetition is best handled by repeating the capture chunk.
              }
            });
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
      let heightLeft = imgHeightInPdf;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add subsequent pages
      while (heightLeft > 2) {
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`${filename}.pdf`);
      
      toast({
        title: "Enterprise PDF Generated",
        description: "Professional multi-page document successfully exported."
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
      className="border-[#c10d12]/20 text-[#c10d12] hover:bg-red-50"
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