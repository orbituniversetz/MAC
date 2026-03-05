import { getDocumentById, getSettings } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DocumentPreview } from '@/components/dashboard/DocumentPreview';
import { DocumentPaper } from '@/components/dashboard/DocumentPaper';

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocumentById(parseInt(id));
  const settings = await getSettings();

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Document Not Found</h2>
        <Button asChild variant="outline"><Link href="/dashboard/documents">Back to list</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/documents" className="flex items-center text-sm text-muted-foreground hover:text-black transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Documents
        </Link>
        <DocumentPreview doc={doc} settings={settings} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white border rounded-xl shadow-2xl overflow-y-auto p-4 sm:p-12 flex justify-center bg-gray-50/50 min-h-[1400px]">
          <div className="origin-top h-fit py-4">
            <DocumentPaper doc={doc} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}