'use client'

import { useState, useEffect } from 'react';
import { getCustomers, getJobSheets, createDocument } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, FileText, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NewDocumentPage() {
  const [docType, setDocType] = useState<'LETTER' | 'REPORT'>('LETTER');
  const [customers, setCustomers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getCustomers().then(setCustomers);
    getJobSheets().then(setJobs);
  }, []);

  return (
    <div className="max-w-3xl auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/documents" className="flex items-center text-sm text-muted-foreground hover:text-black">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Documents
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Create New Document</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setDocType('LETTER')}
          className={cn(
            "p-6 border rounded-xl flex flex-col items-center gap-3 transition-all",
            docType === 'LETTER' ? "border-[#c10d12] bg-red-50 ring-2 ring-red-100" : "bg-white hover:border-gray-300"
          )}
        >
          <Mail className={cn("h-8 w-8", docType === 'LETTER' ? "text-[#c10d12]" : "text-gray-400")} />
          <div className="text-center">
            <p className="font-bold text-sm">Official Letter</p>
            <p className="text-[10px] text-muted-foreground">General correspondence with customers.</p>
          </div>
        </button>

        <button 
          onClick={() => setDocType('REPORT')}
          className={cn(
            "p-6 border rounded-xl flex flex-col items-center gap-3 transition-all",
            docType === 'REPORT' ? "border-[#c10d12] bg-red-50 ring-2 ring-red-100" : "bg-white hover:border-gray-300"
          )}
        >
          <FileText className={cn("h-8 w-8", docType === 'REPORT' ? "text-[#c10d12]" : "text-gray-400")} />
          <div className="text-center">
            <p className="font-bold text-sm">Technical Report</p>
            <p className="text-[10px] text-muted-foreground">Formal vehicle findings and recommendations.</p>
          </div>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createDocument} className="space-y-6">
            <input type="hidden" name="docType" value={docType} />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recipient Customer</Label>
                <select 
                  name="customerId" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {docType === 'REPORT' && (
                <div className="space-y-2">
                  <Label>Reference Job Sheet</Label>
                  <select 
                    name="jobSheetId" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10d12]"
                  >
                    <option value="">Select job sheet...</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.jobNo} - {j.vehiclePlate}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{docType === 'LETTER' ? 'Subject' : 'Report Title'}</Label>
              <Input name="title" placeholder={docType === 'LETTER' ? 'Re: Vehicle Repair Status' : 'Technical Inspection Report'} required />
            </div>

            <div className="space-y-2">
              <Label>Content Body</Label>
              <Textarea 
                name="content" 
                placeholder="Write the document content here..." 
                className="min-h-[300px] font-sans"
                required
              />
              <p className="text-[10px] text-muted-foreground italic">Tip: Use paragraphs for better readability in the generated PDF.</p>
            </div>

            <Button type="submit" className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white py-6 font-bold text-lg">
              Save & Preview {docType === 'LETTER' ? 'Letter' : 'Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
