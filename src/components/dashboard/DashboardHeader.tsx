'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearchBar } from './GlobalSearchBar';
import { FullscreenToggle } from './FullscreenToggle';

const pageMeta: Record<string, { title: string; href?: string; action?: string }> = {
  '/dashboard': { title: 'Dashboard', href: '/dashboard/jobsheets/new', action: 'New Job Sheet' },
  '/dashboard/jobsheets': { title: 'Job Sheets', href: '/dashboard/jobsheets/new', action: 'New Job Sheet' },
  '/dashboard/jobsheets/new': { title: 'New Job Sheet' },
  '/dashboard/expenses': { title: 'Expense Manager' },
  '/dashboard/proformas': { title: 'Proforma Invoices', href: '/dashboard/proformas/new', action: 'New Proforma' },
  '/dashboard/proformas/new': { title: 'New Direct Proforma' },
  '/dashboard/documents': { title: 'Letters & Technical Reports', href: '/dashboard/documents/new', action: 'New Document' },
  '/dashboard/documents/new': { title: 'Create New Document' },
  '/dashboard/invoices': { title: 'Invoices & Receipts' },
  '/dashboard/customers': { title: 'Customers' },
  '/dashboard/vehicles': { title: 'Vehicles' },
  '/dashboard/reports': { title: 'Reports' },
  '/dashboard/trash': { title: 'Recycle Bin' },
  '/dashboard/settings': { title: 'Settings' },
  '/dashboard/backups': { title: 'Backup Manager' },
};

function getMeta(pathname: string) {
  if (pageMeta[pathname]) return pageMeta[pathname];
  if (pathname.startsWith('/dashboard/jobsheets/')) return { title: 'Job Sheet' };
  if (pathname.startsWith('/dashboard/proformas/')) return { title: 'Proforma Invoice' };
  if (pathname.startsWith('/dashboard/invoices/')) return { title: 'Invoice' };
  if (pathname.startsWith('/dashboard/documents/')) return { title: 'Document' };
  return { title: 'GarageFlow' };
}

export function DashboardHeader({ garageName }: { garageName: string }) {
  const meta = getMeta(usePathname());

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-5 flex items-center gap-4 shrink-0 z-30">
      <h1 className="shrink-0 text-lg font-bold tracking-tight text-black">{meta.title}</h1>
      <div className="flex-1 min-w-0"><GlobalSearchBar /></div>
      <div className="flex items-center gap-2 shrink-0">
        <FullscreenToggle />
        <button type="button" onClick={() => window.close()} className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-2 text-xs font-semibold hover:bg-gray-100" title="Close GarageFlow">
          <X className="h-3.5 w-3.5" /> Close App
        </button>
        {meta.href && (
          <Link href={meta.href}>
            <Button size="sm" className="bg-[#c10d12] hover:bg-[#a00b0f]"><Plus className="mr-1.5 h-4 w-4" />{meta.action}</Button>
          </Link>
        )}
        <div className="hidden lg:block border-l border-gray-200 pl-3 leading-tight">
          <p className="text-xs font-semibold text-black">Admin User</p>
          <p className="text-[10px] text-gray-500">Local Instance · {garageName}</p>
        </div>
      </div>
    </header>
  );
}
