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
import { deleteJobSheet } from '@/lib/actions';

interface JobSheetsTableProps {
  jobs: any[];
}

export function JobSheetsTable({ jobs }: JobSheetsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');

  const customersList = useMemo(() => {
    const names = jobs.map(j => j.customerName).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (statusFilter !== 'ALL' && job.status !== statusFilter) {
        return false;
      }
      // Customer filter
      if (customerFilter !== 'ALL' && job.customerName !== customerFilter) {
        return false;
      }
      // Search term filter
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchJobNo = job.jobNo?.toLowerCase().includes(term);
        const matchCustomer = job.customerName?.toLowerCase().includes(term);
        const matchPlate = job.vehiclePlate?.toLowerCase().includes(term);
        const matchComplaint = job.complaint?.toLowerCase().includes(term);
        if (!matchJobNo && !matchCustomer && !matchPlate && !matchComplaint) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, search, statusFilter, customerFilter]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job sheets by Job #, Customer, Vehicle Plate, Complaint..."
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
            <option value="Work In Progress">Work In Progress</option>
            <option value="Quoted">Quoted</option>
            <option value="Invoiced">Invoiced</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
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

      {/* Table */}
      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching job sheets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job: any) => (
                <TableRow key={job.id}>
                  <TableCell className="font-bold">{job.jobNo}</TableCell>
                  <TableCell className="text-xs">{new Date(job.openedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-xs">{job.customerName}</TableCell>
                  <TableCell className="text-xs">{job.vehiclePlate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      job.status === 'Work In Progress' ? 'outline' : 
                      job.status === 'Completed' ? 'secondary' : 
                      job.status === 'Closed' ? 'default' : 'destructive'
                    }>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/dashboard/jobsheets/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <form action={deleteJobSheet.bind(null, job.id)}>
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
