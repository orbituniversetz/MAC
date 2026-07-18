import { getJobSheetById, getSettings, createProformaFromJob, createReportFromJob, deleteJobItem, getRecentItems, deleteExpense, getRecentExpenses } from '@/lib/actions';
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
import { ChevronLeft, Trash2, FilePlus, TrendingUp, TrendingDown, Banknote, FileBadge } from 'lucide-react';
import { redirect } from 'next/navigation';
import { JobCardPreview } from '@/components/dashboard/JobCardPreview';
import { JobCardDocument } from '@/components/dashboard/JobCardDocument';
import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { AddExpenseForm } from '@/components/dashboard/AddExpenseForm';
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function JobSheetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobSheetById(parseInt(id));
  const settings = await getSettings();
  const recentItems = await getRecentItems();
  const recentExpenses = await getRecentExpenses();

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard/jobsheets">Back to Job Sheets</Link>
        </Button>
      </div>
    );
  }

  const income = job.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const totalExpenses = job.expenses.reduce((acc: number, exp: any) => acc + exp.amount, 0);
  const netProfit = income - totalExpenses;
  const isProfit = netProfit >= 0;

  async function handleCreateProforma() {
    'use server'
    const proformaId = await createProformaFromJob(job.id);
    if (proformaId) {
      redirect(`/dashboard/proformas/${proformaId}`);
    }
  }

  async function handleCreateReport() {
    'use server'
    const reportId = await createReportFromJob(job.id);
    if (reportId) {
      redirect(`/dashboard/documents/${reportId}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href="/dashboard/jobsheets" className="flex items-center text-sm text-muted-foreground hover:text-black transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Job Sheets
        </Link>
        <div className="flex items-center gap-2">
           <JobCardPreview job={job} settings={settings} mode="CUSTOMER" />
           <JobCardPreview job={job} settings={settings} mode="INTERNAL" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-sm p-4 border rounded-xl shadow-sm z-20">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-black">{job.jobNo}</h2>
                <Badge className={cn(job.status === 'Draft' ? "bg-zinc-500" : "bg-[#c10d12]")}>{job.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
                <ExportPDFButton targetId="jobcard-document-customer" filename={`JOBCARD-${job.jobNo}`} />
                <form action={handleCreateReport}>
                    <Button variant="outline" type="submit" size="sm" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                        <FileBadge className="mr-2 h-4 w-4" /> Technical Report
                    </Button>
                </form>
                <form action={handleCreateProforma}>
                    <Button variant="outline" type="submit" size="sm" className="border-red-100 hover:bg-red-50 text-red-600">
                        <FilePlus className="mr-2 h-4 w-4" /> Create Proforma
                    </Button>
                </form>
            </div>
        </div>
        
        <div className="bg-gray-100 border rounded-2xl shadow-inner overflow-y-auto p-4 sm:p-12 flex justify-center min-h-[1400px]">
          <div className="origin-top h-fit py-4">
            <JobCardDocument job={job} settings={settings} isInternal={false} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 pb-12">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="bg-zinc-50/50 border-b">
              <CardTitle className="text-base text-black">Repair Items (Income)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.type}</Badge></TableCell>
                      <TableCell className="text-black font-medium">{item.description}</TableCell>
                      <TableCell className="text-black">{item.qty}</TableCell>
                      <TableCell className="text-black">{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-black">{item.subtotal.toLocaleString()}</TableCell>
                      <TableCell>
                        <form action={async () => { 'use server'; await deleteJobItem(item.id, job.id, null); }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                  {job.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">No items added to this job yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <AddItemForm jobId={job.id} proformaId={null} recentItems={recentItems} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="bg-zinc-50/50 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-black">
                <Banknote className="h-4 w-4 text-red-600" />
                Job Expenses (Costs)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.expenses.map((exp: any) => (
                    <TableRow key={exp.id}>
                      <TableCell><Badge variant="outline" className="text-[10px]">{exp.category}</Badge></TableCell>
                      <TableCell className="text-black font-medium">{exp.description}</TableCell>
                      <TableCell className="font-bold text-red-600">-{exp.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <form action={async () => { 'use server'; await deleteExpense(exp.id, job.id, null); }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                  {job.expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">No expenses recorded for this job.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <AddExpenseForm jobSheetId={job.id} recentExpenses={recentExpenses} jobItems={job.items} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={cn("border-l-4 shadow-sm", isProfit ? "border-green-500 bg-green-50/30" : "border-red-500 bg-red-50/30")}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between text-black">
                Profit / Loss
                {isProfit ? <TrendingUp className="text-green-600 h-4 w-4" /> : <TrendingDown className="text-red-600 h-4 w-4" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium text-black">TZS {income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Expenses:</span>
                <span className="font-medium text-red-600">TZS {totalExpenses.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                <span className={cn("font-black text-xl", isProfit ? "text-green-700" : "text-red-600")}>
                  TZS {Math.abs(netProfit).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-zinc-50/50 border-b">
              <CardTitle className="text-base text-black">Customer & Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-black pt-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Customer</p>
                <p className="font-bold">{job.customerName}</p>
                <p className="text-sm">{job.customerPhone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Vehicle</p>
                <p className="font-bold">{job.vehiclePlate}</p>
                <p className="text-sm">{job.vehicleModel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Initial Complaint</p>
                <p className="text-sm italic">"{job.complaint}"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}