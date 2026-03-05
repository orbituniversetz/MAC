'use client'

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrintJobCardButtonProps {
  job: any;
  settings: any;
}

export function PrintJobCardButton({ job, settings }: PrintJobCardButtonProps) {
  const handlePrint = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Logo if exists
    if (settings.garage_logo) {
      try {
        doc.addImage(settings.garage_logo, 'PNG', 14, 10, 20, 20);
        doc.setFontSize(20);
        doc.setTextColor(193, 13, 18);
        doc.text(settings.garage_name || 'M. A. C. GARAGE', 40, 20);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(settings.garage_mailbox || '', 40, 25);
        doc.text(`${settings.garage_address || ''} | Tel: ${settings.garage_phone || ''}`, 40, 30);
      } catch (e) {
        doc.setFontSize(20);
        doc.setTextColor(193, 13, 18);
        doc.text(settings.garage_name || 'M. A. C. GARAGE', 14, 20);
      }
    } else {
      doc.setFontSize(20);
      doc.setTextColor(193, 13, 18);
      doc.text(settings.garage_name || 'M. A. C. GARAGE', 14, 20);
    }

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('JOB CARD / SHEET', pageWidth - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`No: ${job.jobNo}`, pageWidth - 14, 28, { align: 'right' });
    doc.text(`Date: ${new Date(job.openedAt).toLocaleDateString()}`, pageWidth - 14, 33, { align: 'right' });

    doc.setDrawColor(200);
    doc.line(14, 45, pageWidth - 14, 45);

    // Info Grid
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER:', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(job.customerName, 45, 55);
    
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE REG:', 14, 62);
    doc.setFont('helvetica', 'normal');
    doc.text(job.vehiclePlate, 45, 62);

    doc.setFont('helvetica', 'bold');
    doc.text('MAKE/MODEL:', 14, 69);
    doc.setFont('helvetica', 'normal');
    doc.text(job.vehicleModel || 'N/A', 45, 69);

    doc.setFont('helvetica', 'bold');
    doc.text('COMPLAINT:', 14, 80);
    doc.setFont('helvetica', 'normal');
    const complaintLines = doc.splitTextToSize(job.complaint || 'No complaint recorded.', pageWidth - 55);
    doc.text(complaintLines, 45, 80);

    const complaintHeight = (complaintLines.length * 5);
    const tableStartY = 85 + complaintHeight;

    // Items Table (Work Done / Parts)
    const tableData = job.items.map((item: any) => [
      item.type,
      item.description,
      item.qty,
      item.unitPrice.toLocaleString(),
      item.subtotal.toLocaleString()
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [['Type', 'Description', 'Qty', 'Unit Price', 'Subtotal']],
      body: tableData,
      headStyles: { fillColor: [0, 0, 0] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 20;

    // Footer Signatures
    doc.setFontSize(10);
    doc.text('__________________________', 14, finalY + 40);
    doc.text('Garage Supervisor', 14, finalY + 46);

    doc.text('__________________________', pageWidth - 70, finalY + 40);
    doc.text('Customer Signature', pageWidth - 70, finalY + 46);

    doc.save(`JobCard_${job.jobNo}.pdf`);
  };

  return (
    <Button className="bg-[#c10d12]" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> Print Job Card
    </Button>
  );
}
