
import { getDocumentById, getSettings } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PrintDocumentButton } from '@/components/dashboard/PrintDocumentButton';

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
        <Link href="/dashboard/documents" className="flex items-center text-sm text-muted-foreground hover:text-black">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Documents
        </Link>
        <PrintDocumentButton doc={doc} settings={settings} />
      </div>

      <div className="max-w-4xl mx-auto bg-white border rounded-xl shadow-lg overflow-hidden">
        {/* Document Header Representation */}
        <div className="p-8 border-b bg-gray-50 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {settings.garage_logo && (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image 
                  src={settings.garage_logo} 
                  alt="Garage Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
            )}
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-tight">{settings.garage_name}</h1>
              <div className="text-[10px] text-muted-foreground font-medium leading-normal">
                <p>{settings.garage_mailbox}</p>
                <p>{settings.garage_address}</p>
                <p>Tel: {settings.garage_phone}</p>
                <p className="font-bold text-black mt-1">TIN: {settings.garage_tin}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-black mb-2">{doc.docType}</Badge>
            <p className="font-bold text-lg">{doc.docNo}</p>
            <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-12 space-y-8 min-h-[600px]">
          <div className="space-y-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">To:</p>
              <p className="font-bold">{doc.customerName}</p>
              <p className="text-sm">{doc.customerAddress}</p>
              {doc.vehiclePlate && <p className="text-sm italic">Vehicle: {doc.vehiclePlate} ({doc.vehicleModel})</p>}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="space-y-1 pt-4">
              <h2 className="text-xl font-black uppercase border-b-2 border-black inline-block">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
            {doc.content}
          </div>

          <div className="pt-20 space-y-6">
            <p className="text-sm">Yours sincerely,</p>
            <div className="space-y-1">
              <p className="font-bold border-b border-gray-400 w-48 pt-8"></p>
              <p className="text-sm font-bold uppercase">{settings.garage_name} Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
