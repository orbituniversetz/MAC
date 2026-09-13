import { getCustomers } from '@/lib/actions';
import { AddCustomerDialog } from '@/components/dashboard/AddCustomerDialog';
import { CustomersTable } from '@/components/dashboard/CustomersTable';

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sr-only">Customers</h2>
          <p className="text-muted-foreground">Manage your garage clients.</p>
        </div>
        <AddCustomerDialog />
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
