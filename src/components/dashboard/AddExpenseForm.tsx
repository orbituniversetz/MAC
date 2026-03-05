
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceInput } from './PriceInput';
import { Plus, Banknote } from 'lucide-react';
import { addExpense } from '@/lib/actions';

interface AddExpenseFormProps {
  jobSheetId: number | null;
}

export function AddExpenseForm({ jobSheetId }: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PART');
  const [amount, setAmount] = useState<string | number>('');

  async function handleAction(formData: FormData) {
    await addExpense(formData);
    setDescription('');
    setAmount('');
  }

  return (
    <div className="mt-6 border-t pt-4 bg-red-50/30 p-4 rounded-lg">
      <h4 className="font-bold text-sm flex items-center gap-2 mb-4 text-red-800">
        <Banknote className="h-4 w-4" /> Record Job Expense (Wages/Parts/etc)
      </h4>

      <form action={handleAction} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input type="hidden" name="jobSheetId" value={jobSheetId || ''} />
        
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
      </form>
    </div>
  );
}
