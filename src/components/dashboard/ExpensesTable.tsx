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
import { Search, Trash2, Calendar, Link as LinkIcon, Filter } from 'lucide-react';
import { EditExpenseDialog } from '@/components/dashboard/EditExpenseDialog';
import { deleteExpense } from '@/lib/actions';

interface ExpensesTableProps {
  expenses: any[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categoriesList = useMemo(() => {
    const cats = expenses.map(e => e.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      if (categoryFilter !== 'ALL' && exp.category !== categoryFilter) {
        return false;
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchDesc = exp.description?.toLowerCase().includes(term);
        const matchCat = exp.category?.toLowerCase().includes(term);
        const matchJob = exp.jobNo?.toLowerCase().includes(term);
        const matchPf = exp.proformaNo?.toLowerCase().includes(term);
        if (!matchDesc && !matchCat && !matchJob && !matchPf) {
          return false;
        }
      }
      return true;
    });
  }, [expenses, search, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses by Description, Category, Job #, Proforma #..."
            className="pl-9 bg-white text-xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
            <Filter className="h-3.5 w-3.5" /> Category:
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-md text-xs bg-white text-zinc-800 font-medium"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {(search || categoryFilter !== 'ALL') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearch(''); setCategoryFilter('ALL'); }}
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
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching expenses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp: any) => (
                <TableRow key={exp.id}>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {new Date(exp.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">{exp.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-xs">{exp.description}</TableCell>
                  <TableCell className="text-xs">
                    {exp.jobNo ? (
                      <Badge variant="outline" className="flex items-center gap-1 w-fit bg-blue-50">
                        <LinkIcon className="h-2 w-2" /> {exp.jobNo}
                      </Badge>
                    ) : exp.proformaNo ? (
                      <Badge variant="outline" className="flex items-center gap-1 w-fit bg-purple-50">
                        <LinkIcon className="h-2 w-2" /> {exp.proformaNo}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 italic">General</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-red-600 text-xs">-{exp.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right flex justify-end gap-1">
                    <EditExpenseDialog expense={exp} />
                    <form action={deleteExpense.bind(null, exp.id, exp.jobSheetId, exp.proformaId)}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-8 w-8">
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
