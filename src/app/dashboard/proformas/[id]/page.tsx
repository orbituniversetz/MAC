
import { getProformaById, addJobItem, deleteJobItem, getSettings } from '@/lib/actions';
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
import { Trash2, Printer, FileText } from 'lucide-react';
import { PrintProformaButton } from '@/components/dashboard/PrintProformaButton';
import { ProformaPreview } from '@/components/dashboard/ProformaPreview';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-black">{pf.proformaNo}</h2>
          <Badge className="bg-[#c10d12]">{pf.status}</Badge>
          {pf.jobNo && <Badge variant="outline">Linked to {pf.jobNo}</Badge>}
        </div>
        <div className="flex gap-2">
          <ProformaPreview proforma={pf} settings={settings} />
          <PrintProformaButton proforma={pf} settings={settings} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quotation Items</CardTitle>
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
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">{item.subtotal.toLocaleString()}</TableCell>
                    <TableCell>
                      <form action={async () => { 'use server'; await deleteJobItem(item.id, pf.jobSheetId, pf.id); }}>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
                {pf.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No items added yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold mb-4 text-sm">Add New Item</h4>
              <form action={handleAdd} className="grid grid-cols-5 gap-2">
                <select name="type" className="border rounded p-2 text-sm">
                  <option value="PART">Part</option>
                  <option value="LABOUR">Labour</option>
                </select>
                <input name="description" placeholder="Description" required className="border rounded p-2 text-sm col-span-2" />
                <input name="qty" type="number" step="0.1" placeholder="Qty" required className="border rounded p-2 text-sm" />
                <input name="unitPrice" type="number" placeholder="Unit Price" required className="border rounded p-2 text-sm" />
                <Button type="submit" className="bg-black text-white col-span-5 mt-2">Add Item</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Client</p>
                <p className="font-medium text-black">{pf.customerName}</p>
                <p className="text-sm">{pf.customerPhone}</p>
                <p className="text-xs text-muted-foreground italic">{pf.customerAddress}</p>
              </div>
              <Separator />
              {pf.vehiclePlate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Vehicle</p>
                  <p className="font-medium text-black">{pf.vehiclePlate}</p>
                  <p className="text-sm">{pf.vehicleModel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-[#c10d12] border-l-4">
            <CardHeader>
              <CardTitle>Total Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">VAT ({settings.tax_rate}%):</span>
                <span>{taxAmount.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-[#c10d12]">TZS {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
