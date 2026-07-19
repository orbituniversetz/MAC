import { getInvoices, getProformas, convertToInvoice, deleteInvoice } from '@/lib/actions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Eye, Plus, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const proformas = await getProformas();
  const finalizedProformas = proformas.filter((p: any) => p.status === 'Finalized');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Invoices & Receipts</h2>
          <p className="text-muted-foreground">Track payments and financial records.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Job No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv: any) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-bold">{inv.invoiceNo}</TableCell>
                      <TableCell>{inv.jobNo || '-'}</TableCell>
                      <TableCell>{inv.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'Paid' ? 'secondary' : 'outline'} className={inv.status === 'Paid' ? "bg-green-100 text-green-800" : ""}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Link href={`/dashboard/invoices/${inv.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                        </Link>
                        <form action={async () => { 'use server'; await deleteInvoice(inv.id); }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-[#c10d12]/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#c10d12]" />
                New Invoice
              </CardTitle>
              <CardDescription className="text-[10px]">
                Generate an invoice from a finalized quotation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Ready to Invoice:</p>
                {finalizedProformas.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic p-3 border rounded-md bg-gray-50">
                    No finalized proformas found. Go to Proformas to finalize a quotation.
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
                          <form action={async () => { 'use server'; await convertToInvoice(p.id); }}>
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