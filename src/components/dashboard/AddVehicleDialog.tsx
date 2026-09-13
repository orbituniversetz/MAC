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
import { Plus } from 'lucide-react';
import { createVehicle } from '@/lib/actions';

interface AddVehicleDialogProps {
  customers: any[];
}

export function AddVehicleDialog({ customers }: AddVehicleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plateNumber || !customerId) return;
    setIsSubmitting(true);
    try {
      await createVehicle({ 
        customerId: parseInt(customerId.toString()), 
        plateNumber: plateNumber.trim().toUpperCase(), 
        makeModel 
      });
      setIsOpen(false);
      setPlateNumber('');
      setMakeModel('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c10d12] hover:bg-[#a00b0f] text-white">
          <Plus className="mr-2 h-4 w-4" /> Register Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-black">Register New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber" className="text-zinc-800">Plate Number *</Label>
            <Input 
              id="plateNumber"
              required 
              value={plateNumber} 
              onChange={(e) => setPlateNumber(e.target.value)} 
              placeholder="e.g. T123 ABC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="makeModel" className="text-zinc-800">Make & Model</Label>
            <Input 
              id="makeModel"
              value={makeModel} 
              onChange={(e) => setMakeModel(e.target.value)} 
              placeholder="e.g. Toyota Land Cruiser"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId" className="text-zinc-800">Owner (Customer) *</Label>
            <select
              id="customerId"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c10d12] text-zinc-900 border-zinc-200"
            >
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white font-bold mt-2">
            {isSubmitting ? 'Registering...' : 'Register Vehicle'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
