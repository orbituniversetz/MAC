
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from 'lucide-react';
import { updateExpense } from '@/lib/actions';
import { PriceInput } from './PriceInput';

export function EditExpenseDialog({ expense }: { expense: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(expense.amount.toString());

  async function handleUpdate() {
    await updateExpense(expense.id, { 
      description, 
      category, 
      amount: parseFloat(amount.replace(/,/g, '')) 
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Expense Record</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
            >
              <option value="WAGE">Wage / Salary</option>
              <option value="PART">Part Purchase</option>
              <option value="LABOUR">External Labour</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="e.g. New Spark Plugs"
            />
          </div>
          <div className="space-y-2">
            <Label>Amount (TZS)</Label>
            <PriceInput 
              name="amount" 
              defaultValue={amount} 
              onValueChange={(val) => setAmount(val)} 
              placeholder="0.00"
            />
          </div>
          <Button onClick={handleUpdate} className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white">
            Update Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
