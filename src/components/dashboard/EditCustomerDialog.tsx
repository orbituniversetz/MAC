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
import { updateCustomer } from '@/lib/actions';

interface EditCustomerDialogProps {
  customer: any;
}

export function EditCustomerDialog({ customer }: EditCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');
  const [tin, setTin] = useState(customer.tin || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await updateCustomer(customer.id, { name, phone, address, tin });
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
          <DialogTitle className="text-black">Edit Customer Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-800">Full Name *</Label>
            <Input 
              id="name"
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-800">Phone Number</Label>
            <Input 
              id="phone"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="e.g. +255 754 000 000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-zinc-800">Physical Address</Label>
            <Input 
              id="address"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="e.g. Arusha, Tanzania"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tin" className="text-zinc-800">TIN Number</Label>
            <Input 
              id="tin"
              value={tin} 
              onChange={(e) => setTin(e.target.value)} 
              placeholder="e.g. 100-000-000"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white font-bold mt-2">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
