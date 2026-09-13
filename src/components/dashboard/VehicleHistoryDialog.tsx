'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Eye, Car, Wrench, FileText, Receipt, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getVehicleHistory } from '@/lib/actions';

interface VehicleHistoryDialogProps {
  vehicleId: number;
  plateNumber: string;
  makeModel?: string;
  customerName?: string;
}

export function VehicleHistoryDialog({ vehicleId, plateNumber, makeModel, customerName }: VehicleHistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any>(null);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getVehicleHistory(vehicleId);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open) {
      loadHistory();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-gray-300 hover:bg-zinc-100">
          <History className="h-3.5 w-3.5 mr-1 text-[#c10d12]" /> History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-black">
            <Car className="h-5 w-5 text-[#c10d12]" />
            Service History — {plateNumber} {makeModel && <span className="text-sm font-normal text-muted-foreground">({makeModel})</span>}
          </DialogTitle>
          {customerName && (
            <p className="text-xs text-muted-foreground font-medium">
              Registered Owner: <span className="text-black font-bold">{customerName}</span>
            </p>
          )}
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading complete vehicle service records...
          </div>
        ) : !history ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No service history recorded for this vehicle yet.
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <Tabs defaultValue="jobsheets" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="jobsheets" className="flex items-center gap-1.5 text-xs font-bold">
                  <Wrench className="h-3.5 w-3.5" />
                  Job Sheets ({history.jobSheets?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="proformas" className="flex items-center gap-1.5 text-xs font-bold">
                  <FileText className="h-3.5 w-3.5" />
                  Proformas ({history.proformas?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center gap-1.5 text-xs font-bold">
                  <Receipt className="h-3.5 w-3.5" />
                  Invoices ({history.invoices?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Job Sheets Tab */}
              <TabsContent value="jobsheets" className="pt-3">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Complaint / Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.jobSheets?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs italic">
                            No repair job sheets found for this vehicle.
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.jobSheets?.map((js: any) => (
                          <TableRow key={js.id}>
                            <TableCell className="font-bold text-xs">{js.jobNo}</TableCell>
                            <TableCell className="text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(js.openedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs max-w-[220px] truncate">{js.complaint || 'General Service'}</TableCell>
                            <TableCell>
                              <Badge variant={js.status === 'Work In Progress' ? 'outline' : js.status === 'Completed' ? 'secondary' : 'default'} className="text-[10px]">
                                {js.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/jobsheets/${js.id}`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View Job
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Proformas Tab */}
              <TabsContent value="proformas" className="pt-3">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proforma No</TableHead>
                        <TableHead>Ref Job</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.proformas?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs italic">
                            No proforma quotations found for this vehicle.
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.proformas?.map((pf: any) => (
                          <TableRow key={pf.id}>
                            <TableCell className="font-bold text-xs">{pf.proformaNo}</TableCell>
                            <TableCell className="text-xs">{pf.jobSheetId ? `JS #${pf.jobSheetId}` : 'Direct'}</TableCell>
                            <TableCell className="text-xs">{new Date(pf.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={pf.status === 'Quoted' ? 'outline' : 'secondary'} className="text-[10px]">
                                {pf.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/proformas/${pf.id}`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View Proforma
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Invoices Tab */}
              <TabsContent value="invoices" className="pt-3">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.invoices?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs italic">
                            No final invoices found for this vehicle.
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.invoices?.map((inv: any) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-bold text-xs">{inv.invoiceNo}</TableCell>
                            <TableCell className="text-xs">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={inv.status === 'Completed' ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"}>
                                {inv.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/invoices/${inv.id}`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View Invoice
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
