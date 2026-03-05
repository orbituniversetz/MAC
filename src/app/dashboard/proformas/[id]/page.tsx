import { getProformaById, addJobItem, deleteJobItem, getSettings, finalizeProforma, saveProformaDraft } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, Save, Lock, FileCheck, Receipt, Plus } from 'lucide-react';
import { ProformaPreview } from '@/components/dashboard/ProformaPreview';
import { redirect } from 'next/navigation';

export default async function ProformaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pf = await getProformaById(parseInt(id));
  const settings = await getSettings();

  if (!pf) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Proforma Not Found</h2>
        <Button asChild variant="outline">
          <a href="/dashboard/proformas">Back to Proformas</a>
        </Button>
      </div>
    );
  }

  const isFinalized = pf.status === 'Finalized' || pf.status === 'Invoiced';
  const subtotal = pf.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const discount = pf.discount || 0;
  const taxRate = parseFloat(settings.tax_rate || '0') / 100;
  const taxAmount = pf.taxEnabled ? (subtotal - discount) * taxRate : 0;
  const total = subtotal - discount + taxAmount;

  async function handleAdd(formData: FormData) {
    'use server'
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const qty = parseFloat(formData.get('qty') as string);
    const unitPrice = parseFloat(formData.get('unitPrice') as string);
    await addJobItem(pf.jobSheetId, pf.id, { type, description, qty, unitPrice });
  }

  async function handleFinalize() {
    'use server'
    await finalizeProforma(pf.id);
  }

  async function handleSaveDraft() {
    'use server'
    await saveProformaDraft(pf.id);
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border rounded-lg shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">{pf.proformaNo}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant={isFinalized ? 'default' : 'outline'} className={isFinalized ? "bg-green-600" : ""}>
                {pf.status}
              </Badge>
              {pf.jobNo && <Badge variant="secondary">Linked to {pf.jobNo}</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!isFinalized && (
            <>
              <form action={handleSaveDraft}>
                <Button variant="outline" type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
              </form>
              <form action={handleFinalize}>
                <Button className="bg-black text-white hover:bg-gray-800" type="submit">
                  <Lock className="mr-2 h-4 w-4" /> Finalize
                </Button>
              </form>
            </>
          )}
          
          <ProformaPreview proforma={pf} settings={settings} />
          
          {isFinalized && pf.status !== 'Invoiced' && (
            <Button className="bg-[#c10d12]">
              <Receipt className="mr-2 h-4 w-4" /> Convert to Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quotation Items</CardTitle>
            {!isFinalized && <Badge variant="outline">Editable</Badge>}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pf.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">{item.subtotal.toLocaleString()}</TableCell>
                    <TableCell>
                      {!isFinalized && (
                        <form action={async () => { 'use server'; await deleteJobItem(item.id, pf.jobSheetId, pf.id); }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {pf.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">No items added to this proforma yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {!isFinalized && (
              <div className="mt-6 border-t pt-4 bg-gray-50/50 p-4 rounded-lg">
                <h4 className="font-bold mb-4 text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Item
                </h4>
                <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <select name="type" className="border rounded p-2 text-sm bg-white">
                    <option value="PART">Part</option>
                    <option value="LABOUR">Labour</option>
                  </select>
                  <input name="description" placeholder="Item Description" required className="border rounded p-2 text-sm col-span-1 md:col-span-2 bg-white" />
                  <input name="qty" type="number" step="0.1" placeholder="Qty" required className="border rounded p-2 text-sm bg-white" />
                  <input name="unitPrice" type="number" placeholder="Unit Price" required className="border rounded p-2 text-sm bg-white" />
                  <Button type="submit" className="bg-black text-white col-span-1 md:col-span-5">Add Item to Proforma</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Client</p>
                <p className="font-bold text-black">{pf.customerName}</p>
                <p className="text-sm">{pf.customerPhone}</p>
                <p className="text-xs text-muted-foreground italic">{pf.customerAddress}</p>
                <p className="text-xs font-bold mt-1">TIN: {pf.customerTin || 'N/A'}</p>
              </div>
              <Separator />
              {pf.vehiclePlate && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Vehicle</p>
                  <p className="font-bold text-black">{pf.vehiclePlate}</p>
                  <p className="text-sm">{pf.vehicleModel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-[#c10d12] border-l-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">VAT ({settings.tax_rate}%):</span>
                <span className="font-medium">{taxAmount.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Total Payable:</span>
                  <span className="font-black text-xl text-[#c10d12]">TZS {total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right italic">All prices in Tanzanian Shillings</p>
              </div>
            </CardContent>
          </Card>

          {isFinalized && (
            <div className="p-4 border rounded-lg bg-green-50 text-green-800 flex items-center gap-3">
              <FileCheck className="h-5 w-5" />
              <p className="text-xs font-medium">This document is finalized and locked for editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}