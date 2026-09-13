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
import { updateVehicle } from '@/lib/actions';

interface EditVehicleDialogProps {
  vehicle: any;
  customers: any[];
}

export function EditVehicleDialog({ vehicle, customers }: EditVehicleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [plateNumber, setPlateNumber] = useState(vehicle.plateNumber || '');
  const [makeModel, setMakeModel] = useState(vehicle.makeModel || '');
  const [customerId, setCustomerId] = useState(vehicle.customerId || customers[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plateNumber || !customerId) return;
    setIsSubmitting(true);
    try {
      await updateVehicle(vehicle.id, { 
        customerId: parseInt(customerId.toString()), 
        plateNumber: plateNumber.trim().toUpperCase(), 
        makeModel 
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-gray-300">
          <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Vehicle Details</DialogTitle>
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
