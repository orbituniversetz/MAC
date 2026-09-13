'use client'

import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { DeleteVehicleButton } from '@/components/dashboard/DeleteVehicleButton';
import { EditVehicleDialog } from '@/components/dashboard/EditVehicleDialog';
import { VehicleHistoryDialog } from '@/components/dashboard/VehicleHistoryDialog';

interface VehiclesTableProps {
  vehicles: any[];
  customers: any[];
}

export function VehiclesTable({ vehicles, customers }: VehiclesTableProps) {
  const [search, setSearch] = useState('');

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return vehicles;
    const term = search.toLowerCase();
    return vehicles.filter((v) => {
      const matchPlate = v.plateNumber?.toLowerCase().includes(term);
      const matchModel = v.makeModel?.toLowerCase().includes(term);
      const matchOwner = v.customerName?.toLowerCase().includes(term);
      return matchPlate || matchModel || matchOwner;
    });
  }, [vehicles, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter vehicles by Plate Number, Make/Model, Owner..."
          className="pl-9 text-xs bg-white"
        />
      </div>

      <div className="border rounded-md bg-white shadow-sm">
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
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs italic">
                  No matching vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle: any) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-bold text-xs">{vehicle.plateNumber}</TableCell>
                  <TableCell className="text-xs">{vehicle.makeModel || '-'}</TableCell>
                  <TableCell className="text-xs font-medium">{vehicle.customerName || 'N/A'}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <VehicleHistoryDialog 
                      vehicleId={vehicle.id} 
                      plateNumber={vehicle.plateNumber} 
                      makeModel={vehicle.makeModel}
                      customerName={vehicle.customerName}
                    />
                    <EditVehicleDialog vehicle={vehicle} customers={customers} />
                    <DeleteVehicleButton vehicleId={vehicle.id} plateNumber={vehicle.plateNumber} />
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
