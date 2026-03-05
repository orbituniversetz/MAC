'use client'

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Printer, Download, X, Wrench } from 'lucide-react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProformaPreviewProps {
  proforma: any;
  settings: any;
}

export function ProformaPreview({ proforma, settings }: ProformaPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = proforma.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const discount = proforma.discount || 0;
  const taxRate = parseFloat(settings.tax_rate || '0') / 100;
  const taxAmount = proforma.taxEnabled ? (subtotal - discount) * taxRate : 0;
  const total = subtotal - discount + taxAmount;

  const handlePrint = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    let startY = 22;
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

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('PROFORMA INVOICE', pageWidth - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`No: ${proforma.proformaNo}`, pageWidth - 14, 28, { align: 'right' });
    doc.text(`Date: ${new Date(proforma.createdAt).toLocaleDateString()}`, pageWidth - 14, 33, { align: 'right' });

    doc.setDrawColor(200);
    doc.line(14, startY, pageWidth - 14, startY);
    startY += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(proforma.customerName, 14, startY + 6);
    doc.text(proforma.customerAddress || '', 14, startY + 11);
    doc.text(`TIN: ${proforma.customerTin || 'N/A'}`, 14, startY + 16);

    const tableData = proforma.items.map((item: any, index: number) => [
      index + 1,
      item.description,
      item.qty,
      item.unitPrice.toLocaleString(),
      item.subtotal.toLocaleString()
    ]);

    autoTable(doc, {
      startY: startY + 25,
      head: [['No.', 'Description', 'Qty', 'Unit Price (TZS)', 'Total (TZS)']],
      body: tableData,
      headStyles: { fillColor: [193, 13, 18] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || startY + 60;
    
    doc.text('Subtotal:', pageWidth - 60, finalY + 10);
    doc.text(subtotal.toLocaleString(), pageWidth - 14, finalY + 10, { align: 'right' });
    doc.text('Discount:', pageWidth - 60, finalY + 16);
    doc.text(discount.toLocaleString(), pageWidth - 14, finalY + 16, { align: 'right' });
    doc.text('VAT:', pageWidth - 60, finalY + 22);
    doc.text(taxAmount.toLocaleString(), pageWidth - 14, finalY + 22, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 60, finalY + 28);
    doc.text(total.toLocaleString(), pageWidth - 14, finalY + 28, { align: 'right' });

    doc.save(`Proforma_${proforma.proformaNo}.pdf`);
  };

  if (!mounted) {
    return (
      <Button variant="outline">
        <Eye className="mr-2 h-4 w-4" /> Preview Proforma
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Eye className="mr-2 h-4 w-4" /> Preview Proforma
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] w-[95vw] h-[95vh] overflow-y-auto bg-gray-100 p-0">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b px-6 py-4">
          <DialogTitle className="text-lg font-bold">Proforma Preview</DialogTitle>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="bg-[#c10d12]">
              <Printer className="mr-2 h-4 w-4" /> Print / Download
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center p-8">
          <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-[15mm] text-black font-sans leading-tight">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4 items-center">
                {settings.garage_logo ? (
                  <div className="relative h-16 w-16">
                    <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-[#c10d12] rounded flex items-center justify-center">
                    <Wrench className="text-white h-8 w-8" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-[#c10d12] uppercase">{settings.garage_name || 'M. A. C. GARAGE'}</h1>
                  <p className="text-sm font-medium text-gray-600">{settings.garage_mailbox}</p>
                  <p className="text-sm font-medium text-gray-600">{settings.garage_address}</p>
                  <p className="text-sm font-medium text-gray-600">Tel: {settings.garage_phone}</p>
                  <p className="text-sm font-bold text-gray-800">TIN: {settings.garage_tin}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-black text-gray-900 mb-1">PROFORMA INVOICE</h2>
                <p className="text-sm font-bold">No: <span className="text-[#c10d12]">{proforma.proformaNo}</span></p>
                <p className="text-sm">Date: {new Date(proforma.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="h-1 bg-gray-100 mb-8" />

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{proforma.customerName}</p>
                  <p className="text-sm">{proforma.customerAddress || 'No Address Provided'}</p>
                  <p className="text-sm">TIN: {proforma.customerTin || 'N/A'}</p>
                  <p className="text-sm">Tel: {proforma.customerPhone}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-bold">Registration:</span> {proforma.vehiclePlate || 'N/A'}</p>
                  <p className="text-sm"><span className="font-bold">Make/Model:</span> {proforma.vehicleModel || 'N/A'}</p>
                </div>
              </div>
            </div>

            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr className="bg-[#c10d12] text-white">
                  <th className="p-3 text-left text-xs font-bold uppercase w-12">No.</th>
                  <th className="p-3 text-left text-xs font-bold uppercase">Description</th>
                  <th className="p-3 text-center text-xs font-bold uppercase w-20">Qty</th>
                  <th className="p-3 text-right text-xs font-bold uppercase w-32">Unit Price</th>
                  <th className="p-3 text-right text-xs font-bold uppercase w-32">Total (TZS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proforma.items.map((item: any, index: number) => (
                  <tr key={item.id} className="text-sm">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 font-medium">{item.description}</td>
                    <td className="p-3 text-center">{item.qty}</td>
                    <td className="p-3 text-right">{item.unitPrice.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold">{item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
                {proforma.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">No items added to this proforma.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="font-medium">({discount.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT ({settings.tax_rate}%):</span>
                  <span className="font-medium">{taxAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t flex justify-between">
                  <span className="font-bold">TOTAL:</span>
                  <span className="font-bold text-lg text-[#c10d12]">TZS {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-xl mb-8 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Summary</p>
                <h4 className="text-2xl font-bold">Pending Payment</h4>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-400">Balance Due</p>
                <p className="text-3xl font-black">TZS {total.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t pt-8">
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Bank Details</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-bold text-gray-600">Bank:</span> {settings.bank_name}</p>
                  <p><span className="font-bold text-gray-600">Branch:</span> {settings.bank_branch}</p>
                  <p><span className="font-bold text-gray-600">Account Name:</span> {settings.bank_account_name}</p>
                  <p><span className="font-bold text-gray-600">Account Number:</span> {settings.bank_account_number}</p>
                  <p><span className="font-bold text-gray-600">SWIFT:</span> {settings.bank_swift}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Terms & Conditions</h3>
                <div className="text-[10px] text-gray-500 space-y-2 italic">
                  <p>1. This proforma invoice is valid for 14 days from the date of issue.</p>
                  <p>2. Goods remain the property of {settings.garage_name} until full payment is received.</p>
                  <p>3. Please use the Proforma No. <span className="font-bold text-black">{proforma.proformaNo}</span> as your payment reference.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center border-t pt-4">
              <p className="text-[10px] text-gray-400 font-medium italic">Computer generated document. No signature required.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
