import { getInvoiceById, getSettings } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Printer, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { InvoicePreview } from '@/components/dashboard/InvoicePreview';

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
  const taxRate = parseFloat(settings.tax_rate || '0') / 100;
  const taxAmount = snapshot.taxEnabled ? (subtotal - discount) * taxRate : 0;
  const total = subtotal - discount + taxAmount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-sm p-4 border rounded-xl shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold">{inv.invoiceNo}</h2>
            <div className="flex gap-2">
              <Badge className={inv.status === 'Paid' ? "bg-green-600" : "bg-red-600"}>{inv.status}</Badge>
              {inv.jobNo && <Badge variant="secondary">Job Ref: {inv.jobNo}</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <InvoicePreview invoice={inv} settings={settings} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold">Billed Items</h3>
              <span className="text-xs text-muted-foreground italic">Captured at time of invoicing</span>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {snapshot.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-4 font-medium">{item.description}</td>
                      <td className="p-4 text-center">{item.qty}</td>
                      <td className="p-4 text-right">{item.unitPrice.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold">{item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#c10d12]" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT ({settings.tax_rate}%):</span>
                <span>{taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t flex justify-between items-center font-black">
                <span className="text-lg">Total Due:</span>
                <span className="text-2xl text-[#c10d12]">TZS {total.toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full bg-black hover:bg-gray-800">
              Record Payment
            </Button>
          </div>

          <div className="bg-gray-50 border border-dashed rounded-xl p-6 text-center space-y-2">
            <p className="text-xs font-bold uppercase text-muted-foreground">Customer</p>
            <p className="font-bold">{inv.customerName}</p>
            <p className="text-sm">{inv.customerPhone}</p>
            <p className="text-[10px] text-muted-foreground">{inv.customerAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
