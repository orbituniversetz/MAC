import { getJobSheets, deleteJobSheet } from '@/lib/actions';
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
import { Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function JobSheetsPage() {
  const jobs = await getJobSheets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Job Sheets</h2>
          <p className="text-muted-foreground">Manage vehicle repair records.</p>
        </div>
        <Link href="/dashboard/jobsheets/new">
          <Button className="bg-[#c10d12] hover:bg-[#a00b0f]">
            <Plus className="mr-2 h-4 w-4" /> New Job Sheet
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No job sheets found.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job: any) => (
                <TableRow key={job.id}>
                  <TableCell className="font-bold">{job.jobNo}</TableCell>
                  <TableCell>{new Date(job.openedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{job.customerName}</TableCell>
                  <TableCell>{job.vehiclePlate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      job.status === 'Draft' ? 'outline' : 
                      job.status === 'Completed' ? 'secondary' : 
                      job.status === 'Closed' ? 'default' : 'destructive'
                    }>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/dashboard/jobsheets/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <form action={async () => { 'use server'; await deleteJobSheet(job.id); }}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
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