import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { getSettings } from '@/lib/actions';
import { cn } from '@/lib/utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const garageName = settings.garage_name || 'GarageFlow';
  const logo = settings.garage_logo || null;
  const isPerformanceMode = settings.performance_mode === 'true';

  return (
    <div className={cn("flex h-screen bg-white", isPerformanceMode && "performance-mode")}>
      <SidebarNav garageName={garageName} logo={logo} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}