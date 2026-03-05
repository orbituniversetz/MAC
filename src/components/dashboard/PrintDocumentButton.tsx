
'use client'

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';

interface PrintDocumentButtonProps {
  doc: any;
  settings: any;
}

export function PrintDocumentButton({ doc, settings }: PrintDocumentButtonProps) {
  const handlePrint = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Branding Header
    if (settings.garage_logo) {
      try {
        pdf.addImage(settings.garage_logo, 'PNG', margin, 10, 25, 25);
      } catch (e) {}
    }
    
    pdf.setFontSize(22);
    pdf.setTextColor(193, 13, 18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(settings.garage_name || 'M. A. C. GARAGE', margin + 30, 20);
    
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.setFont('helvetica', 'normal');
    pdf.text(settings.garage_mailbox || '', margin + 30, 25);
    pdf.text(`${settings.garage_address || ''} | Tel: ${settings.garage_phone || ''}`, margin + 30, 30);
    pdf.text(`TIN: ${settings.garage_tin || ''}`, margin + 30, 35);

    pdf.setDrawColor(200);
    pdf.line(margin, 40, pageWidth - margin, 40);

    // Date and Ref
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    pdf.text(`Date: ${new Date(doc.createdAt).toLocaleDateString()}`, pageWidth - margin, 50, { align: 'right' });
    pdf.text(`Ref No: ${doc.docNo}`, pageWidth - margin, 55, { align: 'right' });
    if (doc.jobNo) {
      pdf.text(`Job Ref: ${doc.jobNo}`, pageWidth - margin, 60, { align: 'right' });
    }

    // Recipient
    pdf.setFont('helvetica', 'bold');
    pdf.text('TO:', margin, 70);
    pdf.setFont('helvetica', 'normal');
    pdf.text(doc.customerName || 'Valued Customer', margin, 76);
    pdf.text(doc.customerAddress || '', margin, 81);
    
    if (doc.vehiclePlate) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`VEHICLE: ${doc.vehiclePlate} (${doc.vehicleModel || ''})`, margin, 90);
    }

    // Subject
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const titleText = doc.title.toUpperCase();
    pdf.text(titleText, margin, 105);
    const titleWidth = pdf.getTextWidth(titleText);
    pdf.line(margin, 107, margin + titleWidth, 107);

    // Body Content
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const splitContent = pdf.splitTextToSize(doc.content, contentWidth);
    pdf.text(splitContent, margin, 115);

    // Signature
    const lastY = 115 + (splitContent.length * 5) + 30;
    pdf.text('Yours sincerely,', margin, lastY);
    
    pdf.setDrawColor(150);
    pdf.line(margin, lastY + 25, margin + 50, lastY + 25);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${settings.garage_name} Management`, margin, lastY + 31);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text('Computer generated document. Valid without seal.', pageWidth / 2, 285, { align: 'center' });

    pdf.save(`${doc.docType} ${doc.docNo}.pdf`);
  };

  return (
    <Button className="bg-[#c10d12] hover:bg-[#a00b0f]" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> Print Document
    </Button>
  );
}
