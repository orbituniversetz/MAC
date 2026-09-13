
import { getDocuments } from '@/lib/actions';
import { DocumentsTable } from '@/components/dashboard/DocumentsTable';

export default async function DocumentsPage() {
  const docs = await getDocuments();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Manage official correspondence and vehicle inspections.</p>

      <DocumentsTable docs={docs} />
    </div>
  );
}
