'use client'

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrintProformaButtonProps {
  proforma: any;
  settings: any;
}

export function PrintProformaButton({ proforma, settings }: PrintProformaButtonProps) {
  const handlePrint = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Logo if exists
    let startY = 22;
    if (settings.garage_logo) {
      try {
        doc.addImage(settings.garage_logo, 'PNG', 14, 10, 20, 20);
        startY = 22;
        doc.setFontSize(20);
        doc.setTextColor(193, 13, 18);
        doc.text(settings.garage_name || 'M. A. C. GARAGE', 40, 20);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(settings.garage_mailbox || '', 40, 25);
        doc.text(`${settings.garage_address || ''} | Tel: ${settings.garage_phone || ''}`, 40, 30);
        doc.text(`TIN: ${settings.garage_tin || ''}`, 40, 35);
        startY = 45;
      } catch (e) {
        doc.setFontSize(20);
        doc.setTextColor(193, 13, 18);
        doc.text(settings.garage_name || 'M. A. C. GARAGE', 14, 20);
        startY = 30;
      }
    } else {
      doc.setFontSize(20);
      doc.setTextColor(193, 13, 18);
      doc.text(settings.garage_name || 'M. A. C. GARAGE', 14, 20);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(settings.garage_mailbox || '', 14, 28);
      doc.text(`${settings.garage_address || ''} | Tel: ${settings.garage_phone || ''}`, 14, 33);
      doc.text(`TIN: ${settings.garage_tin || ''}`, 14, 38);
      startY = 45;
    }

    // Document Header Info
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('PROFORMA INVOICE', pageWidth - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`No: ${proforma.proformaNo}`, pageWidth - 14, 28, { align: 'right' });
    doc.text(`Date: ${new Date(proforma.createdAt).toLocaleDateString()}`, pageWidth - 14, 33, { align: 'right' });
    if (proforma.jobNo) {
      doc.text(`Ref Job: ${proforma.jobNo}`, pageWidth - 14, 38, { align: 'right' });
    }

    doc.setDrawColor(200);
    doc.line(14, startY, pageWidth - 14, startY);
    startY += 10;

    // Customer & Vehicle Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS:', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(proforma.customerName, 14, startY + 6);
    doc.text(proforma.customerPhone || '', 14, startY + 11);

    if (proforma.vehiclePlate) {
      doc.setFont('helvetica', 'bold');
      doc.text('VEHICLE DETAILS:', 110, startY);
      doc.setFont('helvetica', 'normal');
      doc.text(`Reg No: ${proforma.vehiclePlate}`, 110, startY + 6);
      doc.text(`Model: ${proforma.vehicleModel || 'N/A'}`, 110, startY + 11);
    }

    startY += 25;

    // Items Table
    const tableData = proforma.items.map((item: any) => [
      item.type,
      item.description,
      item.qty,
      item.unitPrice.toLocaleString(),
      item.subtotal.toLocaleString()
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Type', 'Description', 'Qty', 'Unit Price', 'Subtotal']],
      body: tableData,
      headStyles: { fillColor: [193, 13, 18], textColor: [255, 255, 255] },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || startY + 20;
    const subtotal = proforma.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
    const taxRate = parseFloat(settings.tax_rate || '0') / 100;
    const taxAmount = proforma.taxEnabled ? subtotal * taxRate : 0;
    const total = subtotal + taxAmount;

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL (TZS):', pageWidth - 60, finalY + 15, { align: 'right' });
    doc.text(total.toLocaleString(), pageWidth - 14, finalY + 15, { align: 'right' });

    // Payment Info
    if (settings.bank_name) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT INFORMATION:', 14, finalY + 30);
      doc.setFont('helvetica', 'normal');
      doc.text(`Bank: ${settings.bank_name} (${settings.bank_branch || ''})`, 14, finalY + 36);
      doc.text(`Account Name: ${settings.bank_account_name}`, 14, finalY + 41);
      doc.text(`Account Number: ${settings.bank_account_number}`, 14, finalY + 46);
      doc.text(`SWIFT: ${settings.bank_swift || ''}`, 14, finalY + 51);
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for your business!', pageWidth / 2, pageWidth > 250 ? 280 : 285, { align: 'center' });

    doc.save(`Proforma_${proforma.proformaNo}.pdf`);
  };

  return (
    <Button className="bg-[#c10d12]" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> I want to print
    </Button>
  );
}
