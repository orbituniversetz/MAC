
'use client'

import { useState, useEffect } from 'react';
import { getCustomers, getAllVehicles, createProformaDirect } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, UserPlus, CarFront } from 'lucide-react';
import Link from 'next/link';

export default function NewProformaPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [tinValue, setTinValue] = useState('');
  const [plateValue, setPlateValue] = useState('');

  useEffect(() => {
    getCustomers().then(setCustomers);
    getAllVehicles().then(setVehicles);
  }, []);

  const handleTinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '').slice(0, 9);
    
    let formatted = '';
    if (digits.length > 0) formatted += digits.slice(0, 3);
    if (digits.length > 3) formatted += '-' + digits.slice(3, 6);
    if (digits.length > 6) formatted += '-' + digits.slice(6, 9);
    
    setTinValue(formatted);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = raw;
    
    if (raw.startsWith('T')) {
      if (raw.length > 1) {
        formatted = 'T ' + raw.slice(1, 4);
      }
      if (raw.length > 4) {
        formatted += ' ' + raw.slice(4, 7);
      }
    }
    
    setPlateValue(formatted);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">New Direct Proforma</h2>
          <p className="text-muted-foreground">Create a quotation (this will also open a linked Job Sheet).</p>
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
                  <Input 
                    name="newCustomerPhone" 
                    placeholder="+255 765 000 000" 
                    required={isNewCustomer} 
                    pattern="^\+255\d{9}$"
                    title="Phone number must start with +255 followed by 9 digits (e.g., +255765000000)"
                  />
                  <Input name="newCustomerAddress" placeholder="Physical Address" />
                  <Input 
                    name="newCustomerTin" 
                    placeholder="TIN Number (e.g. 108-133-805)" 
                    value={tinValue}
                    onChange={handleTinChange}
                    pattern="\d{3}-\d{3}-\d{3}"
                    title="TIN number must be in the format 000-000-000"
                  />
                </div>
              )}
            </div>

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
                  <Input 
                    name="newVehiclePlate" 
                    placeholder="Plate Number" 
                    required={isNewVehicle || isNewCustomer}
                    value={plateValue}
                    onChange={handlePlateChange}
                  />
                  <Input name="newVehicleModel" placeholder="Make & Model (e.g. Toyota Hilux)" />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Service / Repair Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Briefly describe the job for the linked Job Sheet..." 
                required 
                className="min-h-[100px]"
              />
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
