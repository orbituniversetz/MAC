import { getProformas } from '@/lib/actions';
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
import { FileText, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function ProformasPage() {
  const proformas = await getProformas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Proforma Invoices</h2>
          <p className="text-muted-foreground">Manage quotations and estimates.</p>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proforma No</TableHead>
              <TableHead>Job No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proformas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No proforma invoices found.
                </TableCell>
              </TableRow>
            ) : (
              proformas.map((pf: any) => (
                <TableRow key={pf.id}>
                  <TableCell className="font-bold">{pf.proformaNo}</TableCell>
                  <TableCell>{pf.jobNo}</TableCell>
                  <TableCell>{pf.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={pf.status === 'Draft' ? 'outline' : 'secondary'}>
                      {pf.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(pf.createdAt).toLocaleDateString()}</TableCell>
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
  );
}
