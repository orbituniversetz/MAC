'use client'

import { useState } from 'react';
import Link from 'next/link';
import { History, Car, Eye, FileText, Receipt, Wrench } from 'lucide-react';
import { getCustomerHistory } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CustomerHistoryDialog({ customerId, customerName }: { customerId: number; customerName: string }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load(opened: boolean) {
    setOpen(opened);
    if (!opened) return;
    setLoading(true);
    try { setHistory(await getCustomerHistory(customerId)); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={load}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8"><History className="mr-1 h-3.5 w-3.5 text-[#c10d12]" /> History</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Client History — {customerName}</DialogTitle></DialogHeader>
        {loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading client records…</p> : !history ? <p className="py-8 text-center text-sm text-muted-foreground">No history found.</p> : (
          <Tabs defaultValue="visits">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="visits"><Wrench className="mr-1 h-3.5 w-3.5" /> Visits ({history.jobSheets.length})</TabsTrigger>
              <TabsTrigger value="vehicles"><Car className="mr-1 h-3.5 w-3.5" /> Vehicles ({history.vehicles.length})</TabsTrigger>
              <TabsTrigger value="quotes"><FileText className="mr-1 h-3.5 w-3.5" /> Quotes ({history.proformas.length})</TabsTrigger>
              <TabsTrigger value="invoices"><Receipt className="mr-1 h-3.5 w-3.5" /> Invoices ({history.invoices.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="visits" className="space-y-2 pt-3">
              {history.jobSheets.length === 0 ? <Empty label="No previous visits." /> : history.jobSheets.map((job: any) => <HistoryRow key={job.id} title={job.jobNo} detail={`${job.vehiclePlate || 'No vehicle'} — ${job.complaint || 'Service'}`} status={job.status} date={job.openedAt} href={`/dashboard/jobsheets/${job.id}`} />)}
            </TabsContent>
            <TabsContent value="vehicles" className="space-y-2 pt-3">
              {history.vehicles.length === 0 ? <Empty label="No vehicles registered." /> : history.vehicles.map((vehicle: any) => <div key={vehicle.id} className="flex items-center justify-between rounded border p-3 text-sm"><span className="font-bold">{vehicle.plateNumber} <span className="font-normal text-muted-foreground">{vehicle.makeModel || ''}</span></span><Badge variant="outline">{vehicle.visitCount} visit{vehicle.visitCount === 1 ? '' : 's'}</Badge></div>)}
            </TabsContent>
            <TabsContent value="quotes" className="space-y-2 pt-3">
              {history.proformas.length === 0 ? <Empty label="No quotations issued." /> : history.proformas.map((pf: any) => <HistoryRow key={pf.id} title={pf.proformaNo} detail={pf.vehiclePlate || 'Direct quotation'} status={pf.status} date={pf.createdAt} href={`/dashboard/proformas/${pf.id}`} />)}
            </TabsContent>
            <TabsContent value="invoices" className="space-y-2 pt-3">
              {history.invoices.length === 0 ? <Empty label="No invoices issued." /> : history.invoices.map((invoice: any) => <HistoryRow key={invoice.id} title={invoice.invoiceNo} detail={invoice.vehiclePlate || 'Direct invoice'} status={invoice.status} date={invoice.createdAt} href={`/dashboard/invoices/${invoice.id}`} />)}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Empty({ label }: { label: string }) { return <p className="py-8 text-center text-sm italic text-muted-foreground">{label}</p>; }
function HistoryRow({ title, detail, status, date, href }: { title: string; detail: string; status: string; date: string; href: string }) {
  return <div className="flex items-center justify-between gap-3 rounded border p-3 text-sm"><div><p className="font-bold">{title}</p><p className="text-xs text-muted-foreground">{detail} · {new Date(date).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><Badge variant={status === 'Completed' ? 'secondary' : 'outline'}>{status}</Badge><Link href={href}><Button variant="ghost" size="sm"><Eye className="mr-1 h-3.5 w-3.5" /> View</Button></Link></div></div>;
}
