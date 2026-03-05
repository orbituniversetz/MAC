
import { getDashboardStats } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  CheckCircle2, 
  TrendingDown, 
  CircleDollarSign,
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { title: 'Open Jobs', value: stats.openJobs, icon: Wrench, color: 'text-blue-600' },
    { title: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle2, color: 'text-green-600' },
    { title: 'Total Sales', value: `TZS ${stats.monthlySales.toLocaleString()}`, icon: CircleDollarSign, color: 'text-[#c10d12]' },
    { title: 'Total Expenses', value: `TZS ${stats.totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-600' },
    { title: 'Net Profit', value: `TZS ${stats.netProfit.toLocaleString()}`, icon: TrendingUp, color: 'text-green-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to GarageFlow Management System.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50/50">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
              <p className="text-sm font-medium">Profit Margin: {stats.monthlySales > 0 ? ((stats.netProfit / stats.monthlySales) * 100).toFixed(1) : 0}%</p>
              <p className="text-xs text-muted-foreground italic">Monitor your financial health in real-time.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/jobsheets/new">
              <button className="w-full text-left px-4 py-2 text-sm bg-[#c10d12] text-white rounded-md hover:bg-[#a00b0f] transition-colors">
                New Job Sheet
              </button>
            </Link>
            <Link href="/dashboard/expenses">
              <button className="w-full text-left px-4 py-2 text-sm border border-red-200 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
                Record General Expense
              </button>
            </Link>
            <Link href="/dashboard/reports">
              <button className="w-full text-left px-4 py-2 text-sm border border-[#b0b2b5] rounded-md hover:bg-gray-50 transition-colors">
                Generate Sales Report
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
