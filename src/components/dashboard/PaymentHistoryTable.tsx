'use client'

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
import { Trash2, CreditCard, Calendar, Hash } from 'lucide-react';
import { deletePayment } from '@/lib/actions';

interface PaymentHistoryTableProps {
  payments: any[];
  invoiceId?: number;
  proformaId?: number;
  readOnly?: boolean;
}

export function PaymentHistoryTable({
  payments = [],
  invoiceId,
  proformaId,
  readOnly = false
}: PaymentHistoryTableProps) {
  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 border-b">
              <TableHead className="font-bold text-xs"><Calendar className="h-3.5 w-3.5 inline mr-1" />Date</TableHead>
              <TableHead className="font-bold text-xs"><CreditCard className="h-3.5 w-3.5 inline mr-1" />Method</TableHead>
              <TableHead className="font-bold text-xs"><Hash className="h-3.5 w-3.5 inline mr-1" />Reference</TableHead>
              <TableHead className="font-bold text-xs text-right">Amount (TZS)</TableHead>
              {!readOnly && <TableHead className="w-12 text-right"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 4 : 5} className="text-center py-8 text-muted-foreground italic text-xs">
                  No payments recorded for this document yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id} className="hover:bg-zinc-50/50">
                  <TableCell className="text-xs font-medium text-zinc-600">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      {p.method || 'Cash'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600 font-mono">
                    {p.reference || '-'}
                  </TableCell>
                  <TableCell className="text-right font-black text-green-700 font-mono text-sm">
                    +{p.amount?.toLocaleString()}
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <form
                        action={async () => {
                          if (confirm('Are you sure you want to delete this payment record?')) {
                            await deletePayment(p.id, invoiceId, proformaId);
                          }
                        }}
                      >
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {payments.length > 0 && (
        <div className="flex justify-between items-center px-4 py-2 bg-green-50 rounded-xl border border-green-200">
          <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Total Accumulated Paid</span>
          <span className="text-base font-black text-green-700 font-mono">TZS {totalPaid.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
