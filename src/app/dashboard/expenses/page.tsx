import { getExpenses, deleteExpense } from '@/lib/actions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Trash2, Calendar } from 'lucide-react';
import { AddExpenseForm } from '@/components/dashboard/AddExpenseForm';

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Expense Manager</h2>
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
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ref Job</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No expenses recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((exp: any) => (
                      <TableRow key={exp.id}>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(exp.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">{exp.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{exp.description}</TableCell>
                        <TableCell className="text-xs">{exp.jobNo || 'General'}</TableCell>
                        <TableCell className="font-bold text-red-600">-{exp.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <form action={async () => { 'use server'; await deleteExpense(exp.id, null); }}>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <AddExpenseForm jobSheetId={null} />
              <p className="text-[10px] text-muted-foreground mt-4 italic">
                Recording a general expense will not be linked to any specific job sheet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
