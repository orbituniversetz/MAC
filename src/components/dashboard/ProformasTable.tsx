'use client'

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Search, Eye, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { deleteProforma } from '@/lib/actions';

interface ProformasTableProps {
  proformas: any[];
}

export function ProformasTable({ proformas }: ProformasTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');

  const customersList = useMemo(() => {
    const names = proformas.map(p => p.customerName).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [proformas]);

  const filteredProformas = useMemo(() => {
    return proformas.filter((pf) => {
      if (statusFilter !== 'ALL' && pf.status !== statusFilter) {
        return false;
      }
      if (customerFilter !== 'ALL' && pf.customerName !== customerFilter) {
        return false;
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchProformaNo = pf.proformaNo?.toLowerCase().includes(term);
        const matchJobNo = pf.jobNo?.toLowerCase().includes(term);
        const matchCustomer = pf.customerName?.toLowerCase().includes(term);
        const matchPlate = pf.vehiclePlate?.toLowerCase().includes(term);
        if (!matchProformaNo && !matchJobNo && !matchCustomer && !matchPlate) {
          return false;
        }
      }
      return true;
    });
  }, [proformas, search, statusFilter, customerFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proformas by Proforma #, Job #, Customer, Vehicle Plate..."
            className="pl-9 bg-white text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md text-xs bg-white text-zinc-800 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Quoted">Quoted</option>
            <option value="Invoiced">Invoiced</option>
          </select>

          {customersList.length > 0 && (
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="p-2 border rounded-md text-xs bg-white text-zinc-800 font-medium max-w-[180px] truncate"
            >
              <option value="ALL">All Customers</option>
              {customersList.map((cust: string) => (
                <option key={cust} value={cust}>{cust}</option>
              ))}
            </select>
          )}

          {(search || statusFilter !== 'ALL' || customerFilter !== 'ALL') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearch(''); setStatusFilter('ALL'); setCustomerFilter('ALL'); }}
              className="text-xs text-red-600 hover:text-red-800 h-8"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proforma No</TableHead>
              <TableHead>Job No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProformas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching proforma invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProformas.map((pf: any) => (
                <TableRow key={pf.id}>
                  <TableCell className="font-bold">{pf.proformaNo}</TableCell>
                  <TableCell>{pf.jobNo || <span className="text-xs text-muted-foreground italic">Direct</span>}</TableCell>
                  <TableCell className="font-medium text-xs">{pf.customerName}</TableCell>
                  <TableCell className="text-xs">{pf.vehiclePlate}</TableCell>
                  <TableCell>
                    <Badge variant={pf.status === 'Quoted' ? 'outline' : 'secondary'}>
                      {pf.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{new Date(pf.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/dashboard/proformas/${pf.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <form action={deleteProforma.bind(null, pf.id)}>
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
  );
}
