
import { getJobSheetById, addJobItem, deleteJobItem, createProformaFromJob } from '@/lib/actions';
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
import { Trash2, FilePlus, Printer } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function JobSheetDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobSheetById(parseInt(params.id));

  if (!job) {
    return <div>Job not found</div>;
  }

  const total = job.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);

  async function handleAdd(formData: FormData) {
    'use server'
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const qty = parseFloat(formData.get('qty') as string);
    const unitPrice = parseFloat(formData.get('unitPrice') as string);
    
    await addJobItem(job.id, { type, description, qty, unitPrice });
  }

  async function handleCreateProforma() {
    'use server'
    const proformaId = await createProformaFromJob(job.id);
    if (proformaId) {
      redirect(`/dashboard/proformas/${proformaId}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-black">{job.jobNo}</h2>
          <Badge className="bg-[#c10d12]">{job.status}</Badge>
        </div>
        <div className="flex gap-2">
          <form action={handleCreateProforma}>
            <Button variant="outline" type="submit">
              <FilePlus className="mr-2 h-4 w-4" /> Create Proforma
            </Button>
          </form>
          <Button className="bg-[#c10d12]">
            <Printer className="mr-2 h-4 w-4" /> Print Job Card
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Repair Items</CardTitle>
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
                {job.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">{item.subtotal.toLocaleString()}</TableCell>
                    <TableCell>
                      <form action={async () => { 'use server'; await deleteJobItem(item.id, job.id); }}>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
                {job.items.length === 0 && (
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
              <CardTitle>Customer & Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Customer</p>
                <p className="font-medium text-black">{job.customerName}</p>
                <p className="text-sm">{job.customerPhone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Vehicle</p>
                <p className="font-medium text-black">{job.vehiclePlate}</p>
                <p className="text-sm">{job.vehicleModel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Complaint</p>
                <p className="text-sm italic">"{job.complaint}"</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-lg">
                <span>Estimated Total:</span>
                <span className="font-bold text-[#c10d12]">KES {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
