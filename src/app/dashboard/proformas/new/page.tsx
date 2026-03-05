'use client'

import { useState, useEffect } from 'react';
import { getCustomers, getAllVehicles, createProformaDirect } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, UserPlus, CarFront } from 'lucide-react';
import Link from 'next/link';

export default function NewProformaPage() {
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
          <h2 className="text-3xl font-bold tracking-tight text-black">New Direct Proforma</h2>
          <p className="text-muted-foreground">Create a quotation without opening a job sheet.</p>
        </div>
        <Link href="/dashboard/proformas">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#c10d12]" />
            Quotation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProformaDirect} className="space-y-6">
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
                    if (!isNewCustomer) setIsNewVehicle(true);
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
                  <Input name="newCustomerPhone" placeholder="Phone Number" required={isNewCustomer} />
                  <Input name="newCustomerAddress" placeholder="Physical Address" />
                  <Input name="newCustomerTin" placeholder="TIN Number" />
                </div>
              )}
            </div>

            {/* Vehicle Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold flex items-center gap-2">
                  <CarFront className="h-4 w-4" /> Vehicle (Optional)
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">None / Select a vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.plateNumber} - {v.makeModel} ({v.customerName})</option>
                  ))}
                </select>
              ) : (
                <div className="grid gap-3">
                  <Input name="newVehiclePlate" placeholder="Plate Number" required={isNewVehicle || isNewCustomer} />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white py-6 text-lg font-bold">
              Generate Proforma
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
