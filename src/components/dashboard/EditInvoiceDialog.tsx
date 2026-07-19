
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from 'lucide-react';
import { updateInvoiceStatus } from '@/lib/actions';

export function EditInvoiceDialog({ invoice }: { invoice: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(invoice.status);

  async function handleUpdate() {
    await updateInvoiceStatus(invoice.id, status);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" /> Edit Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Invoice Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <Button onClick={handleUpdate} className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
