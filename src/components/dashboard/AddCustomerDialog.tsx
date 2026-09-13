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
import { createCustomer } from '@/lib/actions';

export function AddCustomerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tin, setTin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await createCustomer({ name, phone, address, tin });
      setIsOpen(false);
      setName('');
      setPhone('');
      setAddress('');
      setTin('');
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
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Customer</DialogTitle>
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
            {isSubmitting ? 'Creating...' : 'Create Customer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
