'use client'

import { useState } from 'react';
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
  FileBadge,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen
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
  { name: 'Recycle Bin', href: '/dashboard/trash', icon: Trash2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Backup Manager', href: '/dashboard/backups', icon: Database },
];

export function SidebarNav({ garageName, logo }: { garageName: string, logo?: string | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("flex flex-col h-full bg-white border-r border-[#b0b2b5] shrink-0", collapsed ? "w-16" : "w-64")}>
      <div className={cn("relative p-6 flex flex-col items-center gap-4 text-center shrink-0", collapsed && "p-3 pt-6")}>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute right-2 top-2 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
        <div className="relative h-20 w-20 overflow-hidden shrink-0">
          {logo ? (
            <Image 
              src={logo} 
              alt="Garage Logo" 
              fill
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Wrench className="text-[#c10d12] h-10 w-10" />
            </div>
          )}
        </div>
        <h1 className={cn("text-xs font-bold tracking-tight text-black leading-tight uppercase line-clamp-2 px-2", collapsed && "hidden")}>
          {garageName}
        </h1>
      </div>
      
      <nav className={cn("flex-1 min-h-0 overflow-y-auto py-2 space-y-1", collapsed ? "px-2" : "px-4")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                collapsed && "justify-center px-2",
                isActive 
                  ? "bg-[#c10d12] text-white" 
                  : "text-black hover:bg-gray-100"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>
      
    </aside>
  );
}
