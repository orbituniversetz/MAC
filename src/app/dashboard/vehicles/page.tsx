import { getAllVehicles, getCustomers } from '@/lib/actions';
import { AddVehicleDialog } from '@/components/dashboard/AddVehicleDialog';
import { VehiclesTable } from '@/components/dashboard/VehiclesTable';

export default async function VehiclesPage() {
  const [vehicles, customers] = await Promise.all([
    getAllVehicles(),
    getCustomers()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sr-only">Vehicles</h2>
          <p className="text-muted-foreground">Registry of all registered vehicles.</p>
        </div>
        <AddVehicleDialog customers={customers} />
      </div>

      <VehiclesTable vehicles={vehicles} customers={customers} />
    </div>
  );
}
