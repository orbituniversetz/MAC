import { getProformaById, getSettings, finalizeProforma, saveProformaDraft, getRecentItems, deleteJobItem, convertToInvoice, updateProformaDiscount, recordProformaPayment } from '@/lib/actions';
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
import { Trash2, Save, Lock, FileCheck, Receipt, Banknote, CreditCard, History } from 'lucide-react';
import { ProformaPreview } from '@/components/dashboard/ProformaPreview';
import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { Label } from '@/components/ui/label';
import { PriceInput } from '@/components/dashboard/PriceInput';

export default async function ProformaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pf = await getProformaById(parseInt(id));
  const settings = await getSettings();
  const recentItems = await getRecentItems();

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
  const isInvoiced = pf.status === 'Invoiced';
  const subtotal = pf.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const discount = pf.discount || 0;
  // Enforce 18% VAT
  const taxAmount = (subtotal - discount) * 0.18;
  const total = subtotal - discount + taxAmount;
  const balanceDue = total - (pf.totalPaid || 0);

  async function handleFinalize() {
    'use server'
    await finalizeProforma(pf.id);
  }

  async function handleSaveDraft() {
    'use server'
    await saveProformaDraft(pf.id);
  }

  async function handleConvertToInvoice() {
    'use server'
    await convertToInvoice(pf.id);
  }

  async function handleUpdateDiscount(formData: FormData) {
    'use server'
    const discountRaw = (formData.get('discount') as string).replace(/,/g, '');
    const discountNum = parseFloat(discountRaw) || 0;
    await updateProformaDiscount(pf.id, discountNum);
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border rounded-lg shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">{pf.proformaNo}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant={isFinalized ? 'default' : 'outline'} className={isInvoiced ? "bg-blue-600" : isFinalized ? "bg-green-600" : ""}>
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
          
          {isFinalized && !isInvoiced && (
            <form action={handleConvertToInvoice}>
              <Button className="bg-[#c10d12]" type="submit">
                <Receipt className="mr-2 h-4 w-4" /> Convert to Invoice
              </Button>
            </form>
          )}

          {isInvoiced && (
            <Button variant="outline" disabled className="bg-blue-50 text-blue-700 border-blue-200">
              <FileCheck className="mr-2 h-4 w-4" /> Already Invoiced
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
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
                <AddItemForm jobId={pf.jobSheetId} proformaId={pf.id} recentItems={recentItems} />
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-green-600" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pf.payments?.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{new Date(p.paidAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-bold text-green-700">{p.amount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{p.method}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {(!pf.payments || pf.payments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground italic text-xs">
                        No payments recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

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

          <Card className="bg-white border rounded-xl p-6 shadow-sm space-y-4 border-l-4 border-l-[#c10d12]">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#c10d12]" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="py-2 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium text-red-600">({discount.toLocaleString()})</span>
                </div>
                
                {!isFinalized && (
                  <form action={handleUpdateDiscount} className="bg-gray-50 p-3 border rounded-md shadow-sm">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1 mb-1.5">
                      <Banknote className="h-3 w-3" /> Set Discount (Cash TZS)
                    </Label>
                    <div className="flex gap-2">
                      <PriceInput name="discount" defaultValue={pf.discount} className="h-9 text-sm" placeholder="Amount (TZS)" />
                      <Button type="submit" size="sm" variant="outline" className="h-9 bg-white">Apply</Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (18%):</span>
                <span>{taxAmount.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Paid to Date:</span>
                <span className="font-bold text-green-600">{pf.totalPaid?.toLocaleString() || 0}</span>
              </div>

              <div className="pt-2 border-t flex justify-between items-center font-black">
                <span className="text-lg">Balance Due:</span>
                <span className="text-2xl text-[#c10d12]">TZS {balanceDue.toLocaleString()}</span>
              </div>
            </div>

            {/* Record Payment Form */}
            {!isInvoiced && (
              <form action={recordProformaPayment} className="space-y-3 bg-red-50/50 p-4 rounded-xl border border-red-100">
                <Label className="text-[10px] uppercase font-black text-red-700 flex items-center gap-1">
                  <Banknote className="h-3 w-3" /> Record New Payment (Cash)
                </Label>
                <input type="hidden" name="proformaId" value={pf.id} />
                <div className="flex gap-2">
                  <PriceInput name="amount" placeholder="Paid Amount" className="h-10 text-sm bg-white" required />
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 h-10 px-4">Record</Button>
                </div>
              </form>
            )}
            
            {isFinalized && !isInvoiced && (
              <form action={handleConvertToInvoice}>
                <Button className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-6">
                  Finalize & Generate Invoice
                </Button>
              </form>
            )}
            
            {!isFinalized && (
               <form action={handleFinalize}>
                <Button className="w-full bg-black hover:bg-gray-800">
                  Finalize Quotation
                </Button>
              </form>
            )}
            
            {isInvoiced && (
              <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                <FileCheck className="mr-2 h-4 w-4" /> Fully Invoiced
              </Button>
            )}
          </Card>

          {isFinalized && (
            <div className="p-4 border rounded-lg bg-green-50 text-green-800 flex items-center gap-3 shadow-sm">
              <FileCheck className="h-5 w-5" />
              <p className="text-[10px] font-medium leading-relaxed">Quotation is finalized. You can still record payments until the final invoice is generated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}