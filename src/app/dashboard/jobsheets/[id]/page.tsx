
import { getJobSheetById, getSettings, createProformaFromJob, deleteJobItem, getRecentItems, deleteExpense } from '@/lib/actions';
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
import { Trash2, FilePlus, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import { redirect } from 'next/navigation';
import { PrintJobCardButton } from '@/components/dashboard/PrintJobCardButton';
import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { AddExpenseForm } from '@/components/dashboard/AddExpenseForm';
import { cn } from '@/lib/utils';

export default async function JobSheetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobSheetById(parseInt(id));
  const settings = await getSettings();
  const recentItems = await getRecentItems();

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <p className="text-muted-foreground">The job sheet you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <a href="/dashboard/jobsheets">Back to Job Sheets</a>
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
          <PrintJobCardButton job={job} settings={settings} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repair Items (Income)</CardTitle>
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
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No items added yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <AddItemForm jobId={job.id} proformaId={null} recentItems={recentItems} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="h-5 w-5 text-red-600" />
                Job Expenses (Costs)
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell>{exp.description}</TableCell>
                      <TableCell className="font-bold text-red-600">-{exp.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <form action={async () => { 'use server'; await deleteExpense(exp.id, job.id); }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                  {job.expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">No expenses recorded for this job.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <AddExpenseForm jobSheetId={job.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={cn("border-l-4 shadow-md", isProfit ? "border-green-500 bg-green-50/30" : "border-red-500 bg-red-50/30")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Profit / Loss
                {isProfit ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium">TZS {income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Expenses:</span>
                <span className="font-medium text-red-600">TZS {totalExpenses.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                  <span className={cn("font-black text-2xl", isProfit ? "text-green-600" : "text-red-600")}>
                    TZS {Math.abs(netProfit).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right italic">Calculated as Income - Expenses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer & Vehicle</CardTitle>
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
        </div>
      </div>
    </div>
  );
}
