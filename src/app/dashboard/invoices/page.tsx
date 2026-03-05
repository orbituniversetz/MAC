import { getInvoices, getProformas } from '@/lib/actions';
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
import { Receipt, Eye, Plus, ArrowRight } from 'lucide-react';
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
                      <TableCell>{inv.jobNo}</TableCell>
                      <TableCell>{inv.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'Paid' ? 'secondary' : 'outline'} className={inv.status === 'Paid' ? "bg-green-100 text-green-800" : ""}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
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
                Invoices must be created from a finalized Proforma.
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
                  <div className="space-y-1">
                    {finalizedProformas.slice(0, 5).map((p: any) => (
                      <Link key={p.id} href={`/dashboard/proformas/${p.id}`} className="block">
                        <div className="group flex items-center justify-between p-2 text-xs border rounded hover:border-[#c10d12] hover:bg-red-50 transition-colors">
                          <div>
                            <p className="font-bold">{p.proformaNo}</p>
                            <p className="text-[10px] text-muted-foreground">{p.customerName}</p>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-[#c10d12]" />
                        </div>
                      </Link>
                    ))}
                    {finalizedProformas.length > 5 && (
                      <Link href="/dashboard/proformas" className="text-[10px] text-[#c10d12] font-bold hover:underline block text-center pt-1">
                        View all finalized quotations
                      </Link>
                    )}
                  </div>
                )}
              </div>
              
              <Link href="/dashboard/proformas" className="block w-full">
                <Button variant="outline" className="w-full text-xs">
                  Go to Proformas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
