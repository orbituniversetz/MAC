import { getInvoiceById, getSettings } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Receipt, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { InvoicePreview } from '@/components/dashboard/InvoicePreview';
import { InvoiceDocument } from '@/components/dashboard/InvoiceDocument';
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton';

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await getInvoiceById(parseInt(id));
  const settings = await getSettings();

  if (!inv) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Invoice Not Found</h2>
        <Button asChild variant="outline"><Link href="/dashboard/invoices">Back to list</Link></Button>
      </div>
    );
  }

  const snapshot = inv.snapshot || {};
  const subtotal = snapshot.items?.reduce((acc: number, item: any) => acc + item.subtotal, 0) || 0;
  const discount = snapshot.discount || 0;
  const taxEnabled = snapshot.taxEnabled === 1;
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-sm p-4 border rounded-xl shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{inv.invoiceNo}</h2>
            <div className="flex gap-2">
              <Badge className={inv.status === 'Paid' ? "bg-green-600" : "bg-red-600"}>{inv.status}</Badge>
              {inv.jobNo && <Badge variant="secondary">Job Ref: {inv.jobNo}</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <ExportPDFButton targetId="invoice-document" filename={`INVOICE-${inv.invoiceNo}`} />
          <InvoicePreview invoice={inv} settings={settings} />
        </div>
      </div>

      {/* Main A4 High-Fidelity Preview - Handles Multi-Page Scrolling */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">High-Fidelity Document Preview</h3>
          <span className="text-[10px] text-zinc-400 italic">Exactly as it will appear on A4 paper (Multi-page supported)</span>
        </div>
        
        <div className="bg-zinc-100/50 border rounded-[2rem] shadow-inner overflow-y-auto p-4 sm:p-12 flex justify-center min-h-[1400px]">
          <div className="origin-top shadow-2xl transition-all hover:shadow-primary/5 h-fit">
             <InvoiceDocument invoice={inv} settings={settings} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3 mt-12">
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white border rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-red-600" />
                Billing Summary
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                    <span className="text-zinc-500 font-medium">Billed To</span>
                    <span className="font-bold text-zinc-900">{inv.customerName}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                    <span className="text-zinc-500 font-medium">Reference Job</span>
                    <span className="font-bold text-zinc-900">{inv.jobNo || 'Direct Invoice'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-500 font-medium">Invoice Date</span>
                    <span className="font-bold text-zinc-900">{new Date(inv.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white border rounded-2xl p-8 shadow-xl space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-red-400 uppercase tracking-widest text-xs">
              <CreditCard className="h-4 w-4" />
              Final Financials
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal:</span>
                <span className="font-mono">{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Discount:</span>
                  <span className="text-red-400 font-mono">({discount.toLocaleString()})</span>
                </div>
              )}
              {taxEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">VAT (18%):</span>
                  <span className="font-mono">{taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-lg font-black uppercase tracking-tighter">Grand Total:</span>
                <span className="text-2xl font-black text-red-500 font-mono">TZS {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
