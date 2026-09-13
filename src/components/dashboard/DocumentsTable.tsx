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
import { Search, Eye, Trash2, Mail, FileText, Filter } from 'lucide-react';
import Link from 'next/link';
import { deleteDocument } from '@/lib/actions';

interface DocumentsTableProps {
  docs: any[];
}

export function DocumentsTable({ docs }: DocumentsTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (typeFilter !== 'ALL' && doc.docType !== typeFilter) {
        return false;
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchDocNo = doc.docNo?.toLowerCase().includes(term);
        const matchTitle = doc.title?.toLowerCase().includes(term);
        const matchCustomer = doc.customerName?.toLowerCase().includes(term);
        const matchJobNo = doc.jobNo?.toLowerCase().includes(term);
        if (!matchDocNo && !matchTitle && !matchCustomer && !matchJobNo) {
          return false;
        }
      }
      return true;
    });
  }, [docs, search, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by Doc #, Title, Subject, Customer, Job #..."
            className="pl-9 bg-white text-xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
            <Filter className="h-3.5 w-3.5" /> Type:
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded-md text-xs bg-white text-zinc-800 font-medium"
          >
            <option value="ALL">All Types</option>
            <option value="LETTER">Letters</option>
            <option value="REPORT">Technical Reports</option>
          </select>

          {(search || typeFilter !== 'ALL') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearch(''); setTypeFilter('ALL'); }}
              className="text-xs text-red-600 hover:text-red-800 h-8"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doc No</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title / Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Ref Job</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching letters or reports found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-bold text-xs">{doc.docNo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit text-[10px]">
                      {doc.docType === 'LETTER' ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {doc.docType === 'LETTER' ? 'Letter' : 'Report'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-xs">{doc.title}</TableCell>
                  <TableCell className="text-xs">{doc.customerName || 'N/A'}</TableCell>
                  <TableCell className="text-xs">{doc.jobNo || '-'}</TableCell>
                  <TableCell className="text-xs">{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <form action={deleteDocument.bind(null, doc.id)}>
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
