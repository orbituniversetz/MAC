'use client'

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Car, Wrench, Receipt, FileText, Users, FileBadge, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { globalSearch } from '@/lib/actions';

export function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query);
        setResults(res);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results && (
    results.jobSheets?.length > 0 ||
    results.proformas?.length > 0 ||
    results.invoices?.length > 0 ||
    results.customers?.length > 0 ||
    results.vehicles?.length > 0 ||
    results.documents?.length > 0
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Global Search (e.g. Plate #, Job #, Invoice #, Customer, Phone)..."
          className="pl-9 pr-8 bg-gray-50 border-gray-200 focus:bg-white transition-all text-sm rounded-lg"
          onFocus={() => { if (query.trim() && results) setIsOpen(true); }}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        ) : query ? (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[75vh] overflow-y-auto p-4 space-y-4">
          {!hasResults ? (
            <div className="text-center py-6 text-xs text-muted-foreground italic">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Vehicles */}
              {results.vehicles?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Car className="h-3.5 w-3.5 text-[#c10d12]" /> Vehicles ({results.vehicles.length})
                  </div>
                  <div className="grid gap-1">
                    {results.vehicles.map((v: any) => (
                      <Link
                        key={v.id}
                        href="/dashboard/vehicles"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-xs transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">{v.plateNumber}</span>
                          {v.makeModel && <span className="text-gray-500">({v.makeModel})</span>}
                        </div>
                        <span className="text-gray-400 font-medium">Owner: {v.customerName || 'N/A'}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Sheets */}
              {results.jobSheets?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Wrench className="h-3.5 w-3.5 text-blue-600" /> Job Sheets ({results.jobSheets.length})
                  </div>
                  <div className="grid gap-1">
                    {results.jobSheets.map((js: any) => (
                      <Link
                        key={js.id}
                        href={`/dashboard/jobsheets/${js.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/50 text-xs transition-colors border border-transparent hover:border-blue-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900">{js.jobNo}</span>
                          <span className="text-gray-500 truncate max-w-[200px]">{js.complaint || 'Service'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{js.customerName}</span>
                          <Badge variant="outline" className="text-[10px]">{js.status}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {results.invoices?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Receipt className="h-3.5 w-3.5 text-green-600" /> Invoices ({results.invoices.length})
                  </div>
                  <div className="grid gap-1">
                    {results.invoices.map((inv: any) => (
                      <Link
                        key={inv.id}
                        href={`/dashboard/invoices/${inv.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-green-50/50 text-xs transition-colors border border-transparent hover:border-green-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-900">{inv.invoiceNo}</span>
                          <span className="text-gray-500">{inv.customerName}</span>
                        </div>
                        <Badge variant="outline" className={inv.status === 'Completed' ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"}>
                          {inv.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Proformas */}
              {results.proformas?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <FileText className="h-3.5 w-3.5 text-purple-600" /> Proforma Quotations ({results.proformas.length})
                  </div>
                  <div className="grid gap-1">
                    {results.proformas.map((pf: any) => (
                      <Link
                        key={pf.id}
                        href={`/dashboard/proformas/${pf.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50/50 text-xs transition-colors border border-transparent hover:border-purple-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-900">{pf.proformaNo}</span>
                          <span className="text-gray-500">{pf.customerName}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{pf.status}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Users className="h-3.5 w-3.5 text-amber-600" /> Customers ({results.customers.length})
                  </div>
                  <div className="grid gap-1">
                    {results.customers.map((c: any) => (
                      <Link
                        key={c.id}
                        href="/dashboard/customers"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50/50 text-xs transition-colors border border-transparent hover:border-amber-100"
                      >
                        <span className="font-bold text-black">{c.name}</span>
                        <span className="text-gray-400">{c.phone || c.tin || 'Customer'}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {results.documents?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <FileBadge className="h-3.5 w-3.5 text-cyan-600" /> Documents & Reports ({results.documents.length})
                  </div>
                  <div className="grid gap-1">
                    {results.documents.map((doc: any) => (
                      <Link
                        key={doc.id}
                        href={`/dashboard/documents/${doc.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-50/50 text-xs transition-colors border border-transparent hover:border-cyan-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-900">{doc.docNo}</span>
                          <span className="text-gray-500 truncate max-w-[200px]">{doc.title}</span>
                        </div>
                        <span className="text-gray-400">{doc.customerName || 'N/A'}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
