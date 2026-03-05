'use client'

import { useState, useEffect } from 'react';
import { getCustomers, getAllVehicles, createJobSheet } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, UserPlus, CarFront } from 'lucide-react';
import Link from 'next/link';

export default function NewJobSheetPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  useEffect(() => {
    getCustomers().then(setCustomers);
    getAllVehicles().then(setVehicles);
  }, []);

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
          <form action={createJobSheet} className="space-y-6">
            {/* Customer Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Customer
                </Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsNewCustomer(!isNewCustomer);
                    if (!isNewCustomer) setIsNewVehicle(true); // Usually new customer = new vehicle
                  }}
                  className="text-[#c10d12] font-semibold"
                >
                  {isNewCustomer ? "Select Existing" : "Add New Customer"}
                </Button>
              </div>

              {!isNewCustomer ? (
                <select 
                  name="customerId" 
                  required={!isNewCustomer}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              ) : (
                <div className="grid gap-3">
                  <Input name="newCustomerName" placeholder="Customer Full Name" required={isNewCustomer} />
                  <Input 
                    name="newCustomerPhone" 
                    placeholder="+255 765 000 000" 
                    required={isNewCustomer} 
                    pattern="^\+255\d{9}$"
                    title="Phone number must start with +255 followed by 9 digits (e.g., +255765000000)"
                  />
                  <Input name="newCustomerAddress" placeholder="Physical Address" />
                  <Input name="newCustomerTin" placeholder="TIN Number" />
                </div>
              )}
            </div>

            {/* Vehicle Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold flex items-center gap-2">
                  <CarFront className="h-4 w-4" /> Vehicle
                </Label>
                {!isNewCustomer && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsNewVehicle(!isNewVehicle)}
                    className="text-[#c10d12] font-semibold"
                  >
                    {isNewVehicle ? "Select Existing" : "Add New Vehicle"}
                  </Button>
                )}
              </div>

              {!isNewVehicle && !isNewCustomer ? (
                <select 
                  name="vehicleId" 
                  required={!isNewVehicle}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.plateNumber} - {v.makeModel} ({v.customerName})</option>
                  ))}
                </select>
              ) : (
                <div className="grid gap-3">
                  <Input name="newVehiclePlate" placeholder="Plate Number (e.g. T 123 ABC)" required={isNewVehicle || isNewCustomer} />
                  <Input name="newVehicleModel" placeholder="Make & Model (e.g. Toyota Hilux)" />
                </div>
              )}
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

            <Button type="submit" className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white py-6 text-lg font-bold">
              Create Job Sheet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
