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

          // A4 aspect ratio in pixels based on the rendered width
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
            if (bottom > pageEnd - 20) { 
              const pushAmount = pageEnd - top + 10; 
              section.style.marginTop = `${pushAmount}px`;
            }
          });

          // 2. Identify and paginate table rows strictly
          const tables = clonedElement.querySelectorAll('table');
          tables.forEach((table: any) => {
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');
            if (!tbody) return;

            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.forEach((row: any) => {
              const rect = row.getBoundingClientRect();
              const top = row.offsetTop + table.offsetTop;
              const bottom = top + rect.height;
              
              const pageNum = Math.floor(top / a4HeightPx);
              const pageEnd = (pageNum + 1) * a4HeightPx;
              
              // If row straddles or starts too close to the end of a page
              if (bottom > pageEnd - 30) {
                const pushAmount = pageEnd - top + 5;
                
                // Create a spacer row to push the content
                const spacer = clonedDoc.createElement('tr');
                spacer.style.height = `${pushAmount}px`;
                spacer.style.backgroundColor = 'white';
                spacer.innerHTML = `<td colspan="100%"></td>`;
                tbody.insertBefore(spacer, row);

                // Clone and repeat table header if it overflows
                if (thead) {
                  const headerClone = thead.cloneNode(true) as HTMLElement;
                  // In HTML, we insert the cloned row(s) from the header into the body
                  const headerRows = Array.from(headerClone.querySelectorAll('tr'));
                  headerRows.forEach((hRow) => {
                    hRow.style.backgroundColor = '#09090b'; // Force background visibility
                    tbody.insertBefore(hRow, row);
                  });
                }
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
        title: "High-Fidelity PDF Generated",
        description: "Professional multi-page document successfully exported with row integrity."
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
