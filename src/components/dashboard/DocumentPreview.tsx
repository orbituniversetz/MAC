'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mail, Printer } from 'lucide-react';
import { DocumentPaper } from './DocumentPaper';
import { PreviewContainer } from './PreviewContainer';

interface DocumentPreviewProps {
  doc: any;
  settings: any;
}

export function DocumentPreview({ doc, settings }: DocumentPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button className="bg-[#c10d12] hover:bg-[#a00b0f]" onClick={() => setIsOpen(true)}>
        <Printer className="mr-2 h-4 w-4" /> Preview & Print
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`Document Preview - ${doc.docNo}`}
          onClose={() => setIsOpen(false)}
          documentId="document-paper"
          filename={`${doc.docType}-${doc.docNo}`}
          icon={doc.docType === 'LETTER' ? <Mail className="h-5 w-5 text-[#c10d12]" /> : <FileText className="h-5 w-5 text-[#c10d12]" />}
        >
          <DocumentPaper doc={doc} settings={settings} />
        </PreviewContainer>
      )}
    </>
  );
}
