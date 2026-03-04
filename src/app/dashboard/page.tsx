import { getDashboardStats } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  CircleDollarSign,
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { title: 'Open Jobs', value: stats.openJobs, icon: Wrench, color: 'text-blue-600' },
    { title: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle2, color: 'text-green-600' },
    { title: 'Pending Payments', value: `TZS ${stats.pendingPayments}`, icon: Clock, color: 'text-orange-600' },
    { title: 'Today\'s Sales', value: `TZS ${stats.todaySales}`, icon: CircleDollarSign, color: 'text-[#c10d12]' },
    { title: 'Monthly Sales', value: `TZS ${stats.monthlySales}`, icon: TrendingUp, color: 'text-[#c10d12]' },
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
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Job Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent jobs found.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <button className="w-full text-left px-4 py-2 text-sm bg-[#c10d12] text-white rounded-md hover:bg-[#a00b0f] transition-colors">
              New Job Sheet
            </button>
            <button className="w-full text-left px-4 py-2 text-sm border border-[#b0b2b5] rounded-md hover:bg-gray-50 transition-colors">
              Add New Customer
            </button>
            <button className="w-full text-left px-4 py-2 text-sm border border-[#b0b2b5] rounded-md hover:bg-gray-50 transition-colors">
              Generate Sales Report
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
