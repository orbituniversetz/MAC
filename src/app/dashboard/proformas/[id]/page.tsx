
import { getProformaById, getSettings, finalizeProforma, saveProformaDraft, getRecentItems, deleteJobItem, convertToInvoice, updateProformaDiscount, recordProformaPayment, updateProformaTaxStatus } from '@/lib/actions';
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
import { ChevronLeft, Trash2, Save, Lock, FileCheck, Receipt, Banknote, CreditCard, History, FileText } from 'lucide-react';
import { ProformaPreview } from '@/components/dashboard/ProformaPreview';
import { ProformaDocument } from '@/components/dashboard/ProformaDocument';
import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { EditItemDialog } from '@/components/dashboard/EditItemDialog';
import { EditProformaDialog } from '@/components/dashboard/EditProformaDialog';
import { Label } from '@/components/ui/label';
import { PriceInput } from '@/components/dashboard/PriceInput';
import { TaxToggle } from '@/components/dashboard/TaxToggle';
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton';
import Link from 'next/link';

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
          <Link href="/dashboard/proformas">Back to Proformas</Link>
        </Button>
      </div>
    );
  }

  const isFinalized = pf.status === 'Finalized' || pf.status === 'Invoiced';
  const isInvoiced = pf.status === 'Invoiced';
  const subtotal = pf.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const discount = pf.discount || 0;
  
  const taxEnabled = pf.taxEnabled !== 0; 
  const taxAmount = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total = subtotal - discount + taxAmount;
  const balanceDue = Math.max(0, total - (pf.totalPaid || 0));
  const isFullyPaid = balanceDue <= 0;

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
    <div className="space-y-6 pb-20">
      <div className="flex items-center">
        <Link href="/dashboard/proformas" className="flex items-center text-sm text-muted-foreground hover:text-black transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Proformas
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border rounded-xl shadow-sm sticky top-0 z-20">
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
          <EditProformaDialog proforma={pf} />
          {!isFinalized && (
            <>
              <form action={handleSaveDraft}>
                <Button variant="outline" type="submit" className="font-bold">
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
              </form>
              <form action={handleFinalize}>
                <Button className="bg-black text-white hover:bg-gray-800 font-bold" type="submit">
                  <Lock className="mr-2 h-4 w-4" /> Finalize
                </Button>
              </form>
            </>
          )}
          
          <ExportPDFButton targetId="proforma-document" filename={`PROFORMA-${pf.proformaNo}`} />
          <ProformaPreview proforma={pf} settings={settings} />
          
          {isFinalized && !isInvoiced && isFullyPaid && (
            <form action={handleConvertToInvoice}>
              <Button className="bg-[#c10d12] text-white hover:bg-[#a00b0f] font-bold" type="submit">
                <Receipt className="mr-2 h-4 w-4" /> Convert to Invoice
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* High-Fidelity Multi-Page Preview */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">High-Fidelity Multi-Page Preview</h3>
          <span className="text-[10px] text-zinc-400 italic">Scroll to view all pages (Total height based on items)</span>
        </div>
        <div className="bg-zinc-100/50 border rounded-[2.5rem] shadow-inner overflow-y-auto p-4 sm:p-12 flex justify-center min-h-[1400px]">
          <div className="origin-top shadow-2xl transition-all duration-300 hover:shadow-primary/10 h-fit">
             <ProformaDocument proforma={pf} settings={settings} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mt-12">
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  Repair Items & Services
                </CardTitle>
                {!isFinalized && <Badge variant="outline" className="bg-blue-50 text-blue-700">Live Editor</Badge>}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 hover:bg-zinc-50 border-b">
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold text-center">Qty</TableHead>
                      <TableHead className="font-bold text-right">Price</TableHead>
                      <TableHead className="font-bold text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pf.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell><Badge variant="outline" className="text-[10px] font-black">{item.type}</Badge></TableCell>
                        <TableCell className="font-medium text-zinc-900">{item.description}</TableCell>
                        <TableCell className="text-center">{item.qty}</TableCell>
                        <TableCell className="text-right font-mono">{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-black text-right font-mono">{item.subtotal.toLocaleString()}</TableCell>
                        <TableCell className="text-right flex justify-end gap-1">
                          {!isFinalized && (
                            <>
                              <EditItemDialog item={item} jobId={pf.jobSheetId} proformaId={pf.id} />
                              <form action={async () => { 'use server'; await deleteJobItem(item.id, pf.jobSheetId, pf.id); }}>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </form>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pf.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">No services listed yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {!isFinalized && (
                <AddItemForm jobId={pf.jobSheetId} proformaId={pf.id} recentItems={recentItems} />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-green-600" />
                Payment & Deposit History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                      <TableCell className="text-zinc-500">{new Date(p.paidAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-black text-green-700 font-mono">+{p.amount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[9px] uppercase tracking-wider">{p.method}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {(!pf.payments || pf.payments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground italic text-xs">
                        No payments recorded for this quotation.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-l-4 border-l-red-600">
            <CardHeader>
              <CardTitle className="text-lg">Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Billing Client</p>
                <p className="font-black text-zinc-900 leading-tight">{pf.customerName}</p>
                <p className="text-xs text-zinc-600 font-medium">{pf.customerPhone}</p>
                <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase">TIN: {pf.customerTin || 'N/A'}</p>
              </div>
              <Separator className="opacity-50" />
              {pf.vehiclePlate && (
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Subject Vehicle</p>
                  <p className="font-black text-zinc-900 leading-tight">{pf.vehiclePlate}</p>
                  <p className="text-xs text-zinc-600 font-medium">{pf.vehicleModel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 text-white rounded-2xl p-8 shadow-2xl space-y-6 border border-zinc-800">
            <h3 className="font-black flex items-center gap-2 text-red-500 uppercase tracking-widest text-xs">
              <CreditCard className="h-4 w-4" />
              Payment Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Gross Subtotal:</span>
                <span className="font-mono">{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="space-y-3">
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Total Discount:</span>
                    <span className="font-black text-red-400 font-mono">({discount.toLocaleString()})</span>
                  </div>
                )}
                
                {!isFinalized && (
                  <form action={handleUpdateDiscount} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-zinc-500 flex items-center gap-1">
                      <Banknote className="h-3 w-3" /> Update Cash Discount
                    </Label>
                    <div className="flex gap-2">
                      <PriceInput name="discount" defaultValue={pf.discount} className="h-9 text-sm bg-zinc-950 border-zinc-800 text-white" placeholder="Amount (TZS)" />
                      <Button type="submit" size="sm" variant="outline" className="h-9 border-zinc-700 bg-transparent text-white hover:bg-zinc-800">Apply</Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex items-center justify-between py-4 border-y border-dashed border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold">Tax Inclusion (18%)</Label>
                  <p className="text-[9px] text-zinc-500 uppercase font-black">Standard TZS VAT</p>
                </div>
                <TaxToggle 
                  proformaId={pf.id} 
                  enabled={taxEnabled} 
                  disabled={isFinalized} 
                />
              </div>

              {taxEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">VAT (18%):</span>
                  <span className="font-mono">{taxAmount.toLocaleString()}</span>
                </div>
              )}

              {isFinalized && (
                <>
                  <div className="flex justify-between text-sm py-1 border-t border-zinc-800 pt-4">
                    <span className="text-zinc-500 font-black">PAID TO DATE:</span>
                    <span className="font-black text-green-500 font-mono">+{pf.totalPaid?.toLocaleString() || 0}</span>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs uppercase font-black text-zinc-500 tracking-widest">Balance Due:</span>
                    <span className="text-2xl font-black text-red-500 tracking-tighter font-mono">TZS {balanceDue.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {!isFinalized && (
               <form action={handleFinalize}>
                <Button className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-black shadow-lg shadow-red-900/20">
                  <Lock className="mr-2 h-5 w-5" /> Finalize Quotation
                </Button>
              </form>
            )}

            {isFinalized && !isInvoiced && !isFullyPaid && (
              <form action={recordProformaPayment} className="space-y-3 bg-red-950/20 p-4 rounded-xl border border-red-900/50">
                <Label className="text-[10px] uppercase font-black text-red-500 flex items-center gap-1">
                  <Banknote className="h-3 w-3" /> Quick Cash Entry
                </Label>
                <input type="hidden" name="proformaId" value={pf.id} />
                <div className="flex gap-2">
                  <PriceInput name="amount" placeholder="Paid Amount" className="h-10 text-sm bg-zinc-950 border-zinc-800 text-white" required />
                  <Button type="submit" className="bg-white text-black hover:bg-zinc-200 h-10 px-4 font-black">Record</Button>
                </div>
              </form>
            )}
            
            {isFinalized && !isInvoiced && isFullyPaid && (
              <form action={handleConvertToInvoice}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 text-lg shadow-lg">
                  <Receipt className="mr-2 h-5 w-5" /> Convert to Final Invoice
                </Button>
              </form>
            )}
            
            {isInvoiced && (
              <div className="p-4 bg-green-950/20 border border-green-900 rounded-xl text-center">
                <p className="text-green-500 font-black flex items-center justify-center gap-2">
                  <FileCheck className="h-5 w-5" /> FULLY INVOICED
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 italic">This record is now permanent.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
