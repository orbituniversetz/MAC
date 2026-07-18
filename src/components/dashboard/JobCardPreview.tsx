'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck } from 'lucide-react';
import { JobCardDocument } from './JobCardDocument';
import { PreviewContainer } from './PreviewContainer';

interface JobCardPreviewProps {
  job: any;
  settings: any;
  mode: 'CUSTOMER' | 'INTERNAL';
}

export function JobCardPreview({ job, settings, mode }: JobCardPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInternal = mode === 'INTERNAL';
  const docId = isInternal ? "jobcard-document-internal" : "jobcard-document-customer";

  if (!mounted) return null;

  return (
    <>
      <Button 
        variant={isInternal ? "outline" : "default"} 
        className={!isInternal ? "bg-[#c10d12] hover:bg-[#a00b0f]" : "border-gray-300"} 
        onClick={() => setIsOpen(true)}
      >
        {isInternal ? <ShieldCheck className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
        {isInternal ? 'Garage Internal Copy' : 'Customer Vehicle Receipt'}
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`${isInternal ? 'Internal Management Copy' : 'Customer Receipt'} - ${job.jobNo}`}
          onClose={() => setIsOpen(false)}
          documentId={docId}
          filename={`JOBCARD-${isInternal ? 'INTERNAL' : 'CUSTOMER'}-${job.jobNo}`}
          icon={isInternal ? <ShieldCheck className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-[#c10d12]" />}
        >
          <JobCardDocument job={job} settings={settings} isInternal={isInternal} />
        </PreviewContainer>
      )}
    </>
  );
}
