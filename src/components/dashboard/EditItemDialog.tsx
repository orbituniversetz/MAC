
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
import { PriceInput } from './PriceInput';
import { Edit2 } from 'lucide-react';
import { updateJobItem } from '@/lib/actions';

interface EditItemDialogProps {
  item: any;
  jobId: number | null;
  proformaId: number | null;
}

export function EditItemDialog({ item, jobId, proformaId }: EditItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState(item.type);
  const [description, setDescription] = useState(item.description);
  const [qty, setQty] = useState(item.qty.toString());
  const [unitPrice, setUnitPrice] = useState(item.unitPrice.toString());

  async function handleUpdate() {
    const qtyNum = parseFloat(qty);
    const unitPriceNum = parseFloat(unitPrice.replace(/,/g, ''));
    
    await updateJobItem(item.id, jobId, proformaId, {
      type,
      description,
      qty: qtyNum,
      unitPrice: unitPriceNum
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Repair Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Type</Label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
            >
              <option value="PART">Part</option>
              <option value="LABOUR">Labour</option>
              <option value="CONSUMABLE">Consumables / Fluids</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Item Description" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Quantity</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={qty} 
                onChange={(e) => setQty(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Unit Price</Label>
              <PriceInput 
                name="unitPrice" 
                defaultValue={unitPrice} 
                onValueChange={(val) => setUnitPrice(val)} 
              />
            </div>
          </div>
        </div>
        <Button onClick={handleUpdate} className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white">
          Update Item
        </Button>
      </DialogContent>
    </Dialog>
  );
}
