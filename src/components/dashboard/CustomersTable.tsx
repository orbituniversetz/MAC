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
import { Input } from '@/components/ui/input';
import { User, Search } from 'lucide-react';
import { DeleteCustomerButton } from '@/components/dashboard/DeleteCustomerButton';
import { EditCustomerDialog } from '@/components/dashboard/EditCustomerDialog';
import { CustomerHistoryDialog } from '@/components/dashboard/CustomerHistoryDialog';

interface CustomersTableProps {
  customers: any[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const term = search.toLowerCase();
    return customers.filter((c) => {
      const matchName = c.name?.toLowerCase().includes(term);
      const matchPhone = c.phone?.toLowerCase().includes(term);
      const matchAddress = c.address?.toLowerCase().includes(term);
      const matchTin = c.tin?.toLowerCase().includes(term);
      return matchName || matchPhone || matchAddress || matchTin;
    });
  }, [customers, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter customers by Name, Phone, Address, TIN..."
          className="pl-9 text-xs bg-white"
        />
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-xs">{customer.phone}</TableCell>
                  <TableCell className="text-xs">{customer.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CustomerHistoryDialog customerId={customer.id} customerName={customer.name} />
                      <EditCustomerDialog customer={customer} />
                      <DeleteCustomerButton customerId={customer.id} customerName={customer.name} />
                    </div>
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
