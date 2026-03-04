import { getAllVehicles } from '@/lib/actions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Car } from 'lucide-react';

export default async function VehiclesPage() {
  const vehicles = await getAllVehicles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Vehicles</h2>
          <p className="text-muted-foreground">Registry of all registered vehicles.</p>
        </div>
        <Button className="bg-[#c10d12] hover:bg-[#a00b0f]">
          <Plus className="mr-2 h-4 w-4" /> Register Vehicle
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Make & Model</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle: any) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-bold">{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.makeModel}</TableCell>
                  <TableCell>{vehicle.customerName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
