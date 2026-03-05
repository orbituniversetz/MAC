
'use client'

import Link from 'next/link';
import Image from 'next/image';
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
  Wrench,
  Banknote,
  FileBadge
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Sheets', href: '/dashboard/jobsheets', icon: Wrench },
  { name: 'Expenses', href: '/dashboard/expenses', icon: Banknote },
  { name: 'Proforma Invoices', href: '/dashboard/proformas', icon: FileText },
  { name: 'Letters & Reports', href: '/dashboard/documents', icon: FileBadge },
  { name: 'Invoices / Receipts', href: '/dashboard/invoices', icon: Receipt },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Backup Manager', href: '/dashboard/backups', icon: Database },
];

export function SidebarNav({ garageName, logo }: { garageName: string, logo?: string | null }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#b0b2b5] w-64">
      <div className="p-6 flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center shrink-0">
          {logo ? (
            <Image 
              src={logo} 
              alt="Garage Logo" 
              fill
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <div className="bg-[#c10d12] h-full w-full flex items-center justify-center">
              <Wrench className="text-white h-6 w-6" />
            </div>
          )}
        </div>
        <h1 className="text-sm font-bold tracking-tight text-black leading-tight uppercase line-clamp-2">
          {garageName}
        </h1>
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
