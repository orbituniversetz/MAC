
import { getCustomers, getAllVehicles, createJobSheet } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default async function NewJobSheetPage() {
  const customers = await getCustomers();
  const vehicles = await getAllVehicles();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">New Job Sheet</h2>
          <p className="text-muted-foreground">Open a new repair record for a vehicle.</p>
        </div>
        <Link href="/dashboard/jobsheets">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-[#c10d12]" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createJobSheet} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer</Label>
              <select 
                id="customerId" 
                name="customerId" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <select 
                id="vehicleId" 
                name="vehicleId" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a vehicle...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.plateNumber} - {v.makeModel} ({v.customerName})</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground italic">Note: Only vehicles registered to the selected customer should ideally be picked.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="complaint">Complaint / Job Description</Label>
              <Textarea 
                id="complaint" 
                name="complaint" 
                placeholder="e.g. Engine noise, Brake pad replacement, Service..." 
                required 
                className="min-h-[120px]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white">
              Create Job Sheet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
