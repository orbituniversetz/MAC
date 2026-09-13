import { getJobSheets } from '@/lib/actions';
import { JobSheetsTable } from '@/components/dashboard/JobSheetsTable';

export default async function JobSheetsPage() {
  const jobs = await getJobSheets();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Manage vehicle repair records.</p>

      <JobSheetsTable jobs={jobs} />
    </div>
  );
}
