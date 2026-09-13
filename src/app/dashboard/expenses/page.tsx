
import { getExpenses, getJobSheets, getProformas, getRecentExpenses } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddExpenseForm } from '@/components/dashboard/AddExpenseForm';
import { ExpensesTable } from '@/components/dashboard/ExpensesTable';

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const jobs = await getJobSheets();
  const proformas = await getProformas();
  const recentExpenses = await getRecentExpenses();

  const total = expenses.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sr-only">Expense Manager</h2>
          <p className="text-muted-foreground">Track all garage costs, wages, and parts purchases.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground uppercase font-bold">Total Expenses</p>
          <p className="text-2xl font-black text-red-600">TZS {total.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesTable expenses={expenses} />
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <AddExpenseForm 
                allJobs={jobs} 
                allProformas={proformas} 
                recentExpenses={recentExpenses}
              />
              <p className="text-[10px] text-muted-foreground mt-4 italic">
                Linking an expense helps track profit and loss for specific repair jobs or quotations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
