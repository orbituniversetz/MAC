import { getInvoices, getProformas, convertToInvoice, getCustomers, getAllVehicles } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Receipt, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateDirectInvoiceDialog } from '@/components/dashboard/CreateDirectInvoiceDialog';
import { InvoicesTable } from '@/components/dashboard/InvoicesTable';

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const proformas = await getProformas();
  const customers = await getCustomers();
  const vehicles = await getAllVehicles();
  const finalizedProformas = proformas.filter((p: any) => p.status === 'Quoted');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sr-only">Invoices & Receipts</h2>
          <p className="text-muted-foreground">Track payments and financial records.</p>
        </div>
        <CreateDirectInvoiceDialog customers={customers} vehicles={vehicles} />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <InvoicesTable invoices={invoices} />
        </div>

        <div className="space-y-6">
          <Card className="border-[#c10d12]/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#c10d12]" />
                New Invoice
              </CardTitle>
              <CardDescription className="text-[10px]">
                Generate an invoice from a quoted proforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Ready to Invoice:</p>
                {finalizedProformas.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic p-3 border rounded-md bg-gray-50">
                    No quoted proformas found. Go to Proformas to prepare a quotation.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {finalizedProformas.slice(0, 5).map((p: any) => (
                      <div key={p.id} className="group flex items-center justify-between p-2 text-xs border rounded bg-white hover:border-[#c10d12] transition-colors">
                        <div className="flex-1">
                          <p className="font-bold">{p.proformaNo}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{p.customerName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link href={`/dashboard/proformas/${p.id}`} title="View Proforma">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <FileText className="h-3 w-3 text-gray-400" />
                            </Button>
                          </Link>
                          <form action={convertToInvoice.bind(null, p.id)}>
                            <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-50" title="Generate Final Invoice">
                              <Plus className="h-4 w-4 text-[#c10d12]" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/dashboard/proformas" className="block w-full">
                <Button variant="outline" className="w-full text-xs">
                  View All Proformas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
