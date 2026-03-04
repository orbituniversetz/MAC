
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { getSettings } from '@/lib/actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const garageName = settings.garage_name || 'GarageFlow';

  return (
    <div className="flex h-screen bg-white">
      <SidebarNav garageName={garageName} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
