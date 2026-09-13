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
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Receipt, User, Car, Calendar, DollarSign } from 'lucide-react';
import { createInvoiceDirect } from '@/lib/actions';
import { PriceInput } from '@/components/dashboard/PriceInput';

interface ItemRow {
  id: string;
  type: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export function CreateDirectInvoiceDialog({
  customers = [],
  vehicles = [],
}: {
  customers: any[];
  vehicles: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerTin, setNewCustomerTin] = useState('');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');

  const [createdAt, setCreatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [discountStr, setDiscountStr] = useState('0');
  const [taxEnabled, setTaxEnabled] = useState(true);

  const [items, setItems] = useState<ItemRow[]>([
    { id: '1', type: 'SERVICE', description: '', qty: 1, unitPrice: 0 }
  ]);

  const filteredVehicles = selectedCustomerId
    ? vehicles.filter((v: any) => v.customerId === parseInt(selectedCustomerId))
    : vehicles;

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'SERVICE', description: '', qty: 1, unitPrice: 0 }
    ]);
  }

  function handleRemoveItem(id: string) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleItemChange(id: string, field: keyof ItemRow, value: any) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const discountNum = parseFloat(discountStr.replace(/,/g, '')) || 0;
  const taxAmount = taxEnabled ? (subtotal - discountNum) * 0.18 : 0;
  const grandTotal = subtotal - discountNum + taxAmount;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c10d12] hover:bg-[#a00b0f] text-white font-bold">
          <Plus className="mr-2 h-4 w-4" /> Create Direct Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-red-600" />
            Create Direct Tax Invoice
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Generate an invoice directly without a prior proforma quotation.
          </DialogDescription>
        </DialogHeader>

        <form action={createInvoiceDirect} className="space-y-6 py-2">
          <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />
          <input type="hidden" name="discount" value={discountStr} />
          <input type="hidden" name="taxEnabled" value={taxEnabled ? 'true' : 'false'} />

          {/* Customer Selection Block */}
          <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <Label className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-red-600" /> Customer Information
            </Label>
            
            <div className="space-y-2">
              <select
                name="customerId"
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setSelectedVehicleId('');
                }}
                className="w-full h-10 px-3 border border-zinc-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="">+ New Customer (Register Inline)</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
                ))}
              </select>
            </div>

            {!selectedCustomerId && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-[10px] font-bold text-zinc-500">Customer Name*</Label>
                  <Input
                    name="newCustomerName"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Full Name / Company"
                    className="h-9 text-xs"
                    required={!selectedCustomerId}
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-500">Phone Number</Label>
                  <Input
                    name="newCustomerPhone"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+255..."
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-500">Billing Address</Label>
                  <Input
                    name="newCustomerAddress"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                    placeholder="Location / Box"
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-500">TIN Number</Label>
                  <Input
                    name="newCustomerTin"
                    value={newCustomerTin}
                    onChange={(e) => setNewCustomerTin(e.target.value)}
                    placeholder="100-XXX-XXX"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vehicle & Date Block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <Label className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-red-600" /> Vehicle Info
              </Label>

              <select
                name="vehicleId"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full h-10 px-3 border border-zinc-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="">+ New Vehicle (Register Inline)</option>
                {filteredVehicles.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.plateNumber} ({v.makeModel})</option>
                ))}
              </select>

              {!selectedVehicleId && (
                <div className="space-y-2 pt-1">
                  <Input
                    name="newVehiclePlate"
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    placeholder="Plate Number (e.g. T 123 ABC)"
                    className="h-9 text-xs"
                  />
                  <Input
                    name="newVehicleModel"
                    value={newVehicleModel}
                    onChange={(e) => setNewVehicleModel(e.target.value)}
                    placeholder="Make / Model (e.g. Toyota Hilux)"
                    className="h-9 text-xs"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <Label className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-red-600" /> Invoice Creation Date
              </Label>
              
              <div>
                <Label className="text-[10px] font-bold text-zinc-500">Date Invoiced</Label>
                <Input
                  type="date"
                  name="createdAt"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="h-10 text-sm font-medium bg-white"
                  required
                />
              </div>

              <div className="pt-2">
                <Label className="text-[10px] font-bold text-zinc-500 block mb-1">VAT Inclusion</Label>
                <button
                  type="button"
                  onClick={() => setTaxEnabled(!taxEnabled)}
                  className={`w-full h-9 rounded-lg text-xs font-bold transition-colors ${
                    taxEnabled ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {taxEnabled ? '18% VAT Included' : 'No VAT (Tax Exempt)'}
                </button>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black uppercase tracking-wider text-zinc-700">
                Invoice Line Items & Services
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-8 text-xs font-bold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Item Row
              </Button>
            </div>

            <div className="border rounded-xl overflow-hidden space-y-2 p-3 bg-white">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="col-span-3">
                    <select
                      value={item.type}
                      onChange={(e) => handleItemChange(item.id, 'type', e.target.value)}
                      className="w-full h-9 px-2 border rounded-md text-xs font-semibold bg-white"
                    >
                      <option value="SERVICE">SERVICE</option>
                      <option value="PART">PART</option>
                      <option value="LABOR">LABOR</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="col-span-4">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 1)}
                      className="h-9 text-xs text-center font-bold"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="h-9 text-xs text-right font-mono font-bold"
                      required
                    />
                  </div>

                  <div className="col-span-1 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals Summary */}
          <div className="bg-zinc-900 text-white p-5 rounded-xl space-y-3">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono">TZS {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Cash Discount:</span>
              <div className="w-36">
                <PriceInput
                  value={discountStr}
                  onValueChange={(val) => setDiscountStr(val)}
                  placeholder="0"
                  className="h-8 text-xs bg-zinc-950 border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            {taxEnabled && (
              <div className="flex justify-between text-xs text-zinc-400">
                <span>VAT (18%):</span>
                <span className="font-mono">TZS {taxAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-sm font-black uppercase">Grand Total:</span>
              <span className="text-xl font-black text-red-500 font-mono">TZS {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white font-black h-12 text-base shadow-lg"
          >
            Create Direct Tax Invoice
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
