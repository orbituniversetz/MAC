import { getProformas } from '@/lib/actions';
import { ProformasTable } from '@/components/dashboard/ProformasTable';

export default async function ProformasPage() {
  const proformas = await getProformas();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Manage quotations and estimates.</p>

      <ProformasTable proformas={proformas} />
    </div>
  );
}
