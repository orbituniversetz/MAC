
import { getDocuments, deleteDocument } from '@/lib/actions';
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
import { Plus, Eye, FileText, Trash2, Mail } from 'lucide-react';
import Link from 'next/link';

export default async function DocumentsPage() {
  const docs = await getDocuments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Letters & Technical Reports</h2>
          <p className="text-muted-foreground">Manage official correspondence and vehicle inspections.</p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button className="bg-[#c10d12] hover:bg-[#a00b0f]">
            <Plus className="mr-2 h-4 w-4" /> New Document
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doc No</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title / Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Ref Job</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No letters or reports found.
                </TableCell>
              </TableRow>
            ) : (
              docs.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-bold">{doc.docNo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {doc.docType === 'LETTER' ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {doc.docType === 'LETTER' ? 'Letter' : 'Report'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{doc.customerName || 'N/A'}</TableCell>
                  <TableCell>{doc.jobNo || '-'}</TableCell>
                  <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <form action={async () => { 'use server'; await deleteDocument(doc.id); }}>
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
