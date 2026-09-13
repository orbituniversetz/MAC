import { getTrashItems, restoreItem, permanentlyDeleteItem, emptyTrash } from '@/lib/actions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, RotateCcw, AlertTriangle, Wrench, FileText, Receipt, Users, Car, Banknote, FileBadge, Calendar } from 'lucide-react';

export default async function TrashPage() {
  const trash = await getTrashItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black flex items-center gap-2">
            <Trash2 className="h-7 w-7 text-[#c10d12]" />
            Recycle Bin
          </h2>
          <p className="text-muted-foreground">
            Recover deleted records or permanently erase them from system storage.
          </p>
        </div>
        {trash.totalCount > 0 && (
          <form action={emptyTrash}>
            <Button variant="destructive" size="sm" type="submit" className="font-bold flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Empty Recycle Bin ({trash.totalCount})
            </Button>
          </form>
        )}
      </div>

      <Card className="border-red-100 bg-red-50/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-red-900 font-bold">
            <AlertTriangle className="h-4 w-4 text-[#c10d12]" />
            Accidental Deletion Protection
          </CardTitle>
          <CardDescription className="text-xs text-zinc-600">
            Deleted items stay in the Recycle Bin until you permanently erase them or click "Empty Recycle Bin". Click <strong>Restore</strong> to instantly send an item back to its active menu.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="jobsheets" className="w-full">
        <TabsList className="flex flex-wrap w-full bg-gray-100 p-1 h-auto gap-1">
          <TabsTrigger value="jobsheets" className="flex-1 text-xs font-bold py-2">
            <Wrench className="h-3.5 w-3.5 mr-1 text-blue-600" /> Job Sheets ({trash.jobSheets.length})
          </TabsTrigger>
          <TabsTrigger value="proformas" className="flex-1 text-xs font-bold py-2">
            <FileText className="h-3.5 w-3.5 mr-1 text-purple-600" /> Proformas ({trash.proformas.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1 text-xs font-bold py-2">
            <Receipt className="h-3.5 w-3.5 mr-1 text-green-600" /> Invoices ({trash.invoices.length})
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex-1 text-xs font-bold py-2">
            <Users className="h-3.5 w-3.5 mr-1 text-amber-600" /> Customers ({trash.customers.length})
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex-1 text-xs font-bold py-2">
            <Car className="h-3.5 w-3.5 mr-1 text-red-600" /> Vehicles ({trash.vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex-1 text-xs font-bold py-2">
            <Banknote className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Expenses ({trash.expenses.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 text-xs font-bold py-2">
            <FileBadge className="h-3.5 w-3.5 mr-1 text-cyan-600" /> Documents ({trash.documents.length})
          </TabsTrigger>
        </TabsList>

        {/* Job Sheets Tab */}
        <TabsContent value="jobsheets" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job No</TableHead>
                  <TableHead>Customer / Vehicle</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.jobSheets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted job sheets in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.jobSheets.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.jobNo}</TableCell>
                      <TableCell className="text-xs">{item.customerName || 'N/A'} ({item.vehiclePlate || 'N/A'})</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{item.complaint || 'Service'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'jobsheet', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'jobsheet', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Proformas Tab */}
        <TabsContent value="proformas" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proforma No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.proformas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted proforma quotations in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.proformas.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.proformaNo}</TableCell>
                      <TableCell className="text-xs">{item.customerName || 'N/A'}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'proforma', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'proforma', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted invoices in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.invoices.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.invoiceNo}</TableCell>
                      <TableCell className="text-xs">{item.customerName || 'N/A'}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'invoice', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'invoice', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted customers in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.customers.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.name}</TableCell>
                      <TableCell className="text-xs">{item.phone || '-'}</TableCell>
                      <TableCell className="text-xs">{item.tin || '-'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'customer', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'customer', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted vehicles in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.vehicles.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.plateNumber}</TableCell>
                      <TableCell className="text-xs">{item.makeModel || '-'}</TableCell>
                      <TableCell className="text-xs">{item.customerName || 'N/A'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'vehicle', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'vehicle', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted expenses in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.expenses.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.category}</Badge></TableCell>
                      <TableCell className="text-xs font-medium">{item.description}</TableCell>
                      <TableCell className="text-xs font-bold text-red-600">TZS {item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'expense', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'expense', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="pt-4">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doc No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date Deleted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trash.documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs italic">
                      No deleted documents in trash.
                    </TableCell>
                  </TableRow>
                ) : (
                  trash.documents.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-xs">{item.docNo}</TableCell>
                      <TableCell className="text-xs font-medium">{item.title}</TableCell>
                      <TableCell className="text-xs">{item.customerName || 'N/A'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={restoreItem.bind(null, 'document', item.id)}>
                          <Button variant="outline" size="sm" type="submit" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50">
                            <RotateCcw className="h-3 w-3 mr-1" /> Restore
                          </Button>
                        </form>
                        <form action={permanentlyDeleteItem.bind(null, 'document', item.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            Erase Permanently
                          </Button>
                        </form>
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
  );
}
