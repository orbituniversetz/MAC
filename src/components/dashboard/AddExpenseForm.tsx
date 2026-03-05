'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceInput } from './PriceInput';
import { Banknote, Link as LinkIcon, History } from 'lucide-react';
import { addExpense } from '@/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddExpenseFormProps {
  jobSheetId?: number | null;
  proformaId?: number | null;
  allJobs?: any[];
  allProformas?: any[];
  recentExpenses?: any[];
}

export function AddExpenseForm({ jobSheetId, proformaId, allJobs = [], allProformas = [], recentExpenses = [] }: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PART');
  const [amount, setAmount] = useState<string | number>('');
  const [linkType, setLinkType] = useState(jobSheetId ? 'job' : proformaId ? 'proforma' : 'general');
  const [selectedJobId, setSelectedJobId] = useState(jobSheetId?.toString() || '');
  const [selectedProformaId, setSelectedProformaId] = useState(proformaId?.toString() || '');

  const handleRecentPick = (exp: any) => {
    setCategory(exp.category);
    setDescription(exp.description);
    setAmount(exp.amount);
  };

  async function handleAction(formData: FormData) {
    if (linkType === 'general') {
      formData.delete('jobSheetId');
      formData.delete('proformaId');
    } else if (linkType === 'job') {
      formData.set('jobSheetId', selectedJobId);
      formData.delete('proformaId');
    } else if (linkType === 'proforma') {
      formData.set('proformaId', selectedProformaId);
      formData.delete('jobSheetId');
    }

    await addExpense(formData);
    setDescription('');
    setAmount('');
  }

  const isContextual = !!jobSheetId || !!proformaId;

  return (
    <div className="mt-6 border-t pt-4 bg-red-50/30 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm flex items-center gap-2 text-red-800">
          <Banknote className="h-4 w-4" /> 
          {isContextual ? 'Record Expense for this Document' : 'Record Garage Expense'}
        </h4>

        {recentExpenses.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-red-200 bg-white/50 text-red-800 hover:bg-red-50">
                <History className="mr-1.5 h-3.5 w-3.5" /> Quick Pick Previous
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent Expenses</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentExpenses.map((exp, idx) => (
                <DropdownMenuItem 
                  key={idx} 
                  onClick={() => handleRecentPick(exp)} 
                  className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                >
                  <div className="flex justify-between w-full items-start">
                    <span className="font-bold text-xs text-black">{exp.description}</span>
                    <span className="text-[9px] bg-red-100 px-1.5 py-0.5 rounded font-black text-red-600 uppercase">{exp.category}</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-700">TZS {exp.amount.toLocaleString()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <form action={handleAction} className="space-y-4">
        {!isContextual && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white/50 rounded-md border border-red-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-red-700 flex items-center gap-1">
                <LinkIcon className="h-3 w-3" /> Link Expense To
              </label>
              <select 
                value={linkType}
                onChange={(e) => setLinkType(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="general">General / Non-linked</option>
                <option value="job">Specific Job Sheet</option>
                <option value="proforma">Specific Proforma</option>
              </select>
            </div>

            {linkType === 'job' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-red-700">Select Job Sheet</label>
                <select 
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Choose a Job...</option>
                  {allJobs.map(j => (
                    <option key={j.id} value={j.id}>{j.jobNo} - {j.customerName} ({j.vehiclePlate})</option>
                  ))}
                </select>
              </div>
            )}

            {linkType === 'proforma' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-red-700">Select Proforma</label>
                <select 
                  value={selectedProformaId}
                  onChange={(e) => setSelectedProformaId(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Choose a Proforma...</option>
                  {allProformas.map(p => (
                    <option key={p.id} value={p.id}>{p.proformaNo} - {p.customerName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {jobSheetId && <input type="hidden" name="jobSheetId" value={jobSheetId} />}
          {proformaId && <input type="hidden" name="proformaId" value={proformaId} />}
          
          <select 
            name="category" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="WAGE">Wage / Salary</option>
            <option value="PART">Part Purchase</option>
            <option value="LABOUR">External Labour</option>
            <option value="OTHER">Other</option>
          </select>
          
          <input 
            name="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Mechanic Wage, New Spark Plugs..." 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 col-span-1 md:col-span-2" 
          />
          
          <PriceInput 
            name="amount" 
            defaultValue={amount}
            placeholder="Amount (TZS)" 
            className="bg-white text-sm" 
            required
          />
          
          <Button type="submit" className="bg-red-800 text-white hover:bg-red-900 col-span-1 md:col-span-4 h-11 font-bold">
            Record Expense
          </Button>
        </div>
      </form>
    </div>
  );
}
