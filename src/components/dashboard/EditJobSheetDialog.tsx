
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from 'lucide-react';
import { updateJobSheet } from '@/lib/actions';

export function EditJobSheetDialog({ job }: { job: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [complaint, setComplaint] = useState(job.complaint);
  const [status, setStatus] = useState(job.status);

  async function handleUpdate() {
    await updateJobSheet(job.id, { complaint, status });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" /> Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job Sheet Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Complaint / Job Description</Label>
            <Textarea 
              value={complaint} 
              onChange={(e) => setComplaint(e.target.value)} 
              rows={4} 
              placeholder="Enter customer complaint or work description..."
            />
          </div>
          <div className="space-y-2">
            <Label>Job Status</Label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
            >
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
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
