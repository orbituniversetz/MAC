
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

  return (
    <div className="flex h-screen bg-white">
      <SidebarNav garageName={garageName} logo={logo} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
