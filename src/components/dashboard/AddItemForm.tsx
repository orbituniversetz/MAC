'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceInput } from './PriceInput';
import { Plus, History } from 'lucide-react';
import { addJobItem } from '@/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddItemFormProps {
  jobId: number | null;
  proformaId: number | null;
  recentItems: any[];
}

export function AddItemForm({ jobId, proformaId, recentItems }: AddItemFormProps) {
  const [type, setType] = useState('PART');
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('1');
  const [unitPrice, setUnitPrice] = useState<string | number>('');

  const handleRecentPick = (item: any) => {
    setType(item.type);
    setDescription(item.description);
    setUnitPrice(item.unitPrice);
  };

  async function handleAction(formData: FormData) {
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const qty = parseFloat(formData.get('qty') as string);
    const unitPriceRaw = (formData.get('unitPrice') as string).replace(/,/g, '');
    const unitPriceNum = parseFloat(unitPriceRaw);

    await addJobItem(jobId, proformaId, { type, description, qty, unitPrice: unitPriceNum });
    
    // Reset form
    setDescription('');
    setUnitPrice('');
    setQty('1');
  }

  return (
    <div className="mt-6 border-t pt-4 bg-gray-50/50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Item
        </h4>
        
        {recentItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-gray-300">
                <History className="mr-1.5 h-3.5 w-3.5 text-[#c10d12]" /> Quick Pick Previous
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent Parts & Labour</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentItems.map((item, idx) => (
                <DropdownMenuItem 
                  key={idx} 
                  onClick={() => handleRecentPick(item)} 
                  className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                >
                  <div className="flex justify-between w-full items-start">
                    <span className="font-bold text-xs text-black">{item.description}</span>
                    <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded font-black text-gray-500">{item.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#c10d12]">TZS {item.unitPrice.toLocaleString()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <form action={handleAction} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select 
          name="type" 
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
        >
          <option value="PART">Part</option>
          <option value="LABOUR">Labour</option>
        </select>
        
        <input 
          name="description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item Description (e.g. Front Brake Pads)" 
          required 
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12] col-span-1 md:col-span-2" 
        />
        
        <input 
          name="qty" 
          type="number" 
          step="0.1" 
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty" 
          required 
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]" 
        />
        
        <PriceInput 
          name="unitPrice" 
          defaultValue={unitPrice}
          placeholder="Unit Price" 
          className="bg-white text-sm" 
          required
        />
        
        <Button type="submit" className="bg-black text-white hover:bg-gray-800 col-span-1 md:col-span-5 h-11 font-bold">
          Add Item to List
        </Button>
      </form>
    </div>
  );
}
