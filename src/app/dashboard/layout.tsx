
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { getSettings } from '@/lib/actions';

// Ensure the dashboard is always rendered dynamically to avoid build-time database access
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const garageName = settings.garage_name || 'GarageFlow';
  const logo = settings.garage_logo || null;

  return (
    <div className="flex h-screen bg-white">
      <SidebarNav garageName={garageName} logo={logo} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader garageName={garageName} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
