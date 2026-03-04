
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  Car, 
  BarChart3, 
  Settings, 
  Database,
  Wrench
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Sheets', href: '/dashboard/jobsheets', icon: Wrench },
  { name: 'Proforma Invoices', href: '/dashboard/proformas', icon: FileText },
  { name: 'Invoices / Receipts', href: '/dashboard/invoices', icon: Receipt },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Backup Manager', href: '/dashboard/backups', icon: Database },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#b0b2b5] w-64">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#c10d12] p-2 rounded-lg">
          <Wrench className="text-white h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-black">GarageFlow</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-[#c10d12] text-white" 
                  : "text-black hover:bg-gray-100"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#b0b2b5]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold text-black">Admin User</p>
            <p className="text-[10px] text-gray-500">Local Instance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
