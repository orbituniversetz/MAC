'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ProformaDocument } from './ProformaDocument';
import { PreviewContainer } from './PreviewContainer';

interface ProformaPreviewProps {
  proforma: any;
  settings: any;
}

export function ProformaPreview({ proforma, settings }: ProformaPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="mr-2 h-4 w-4" /> Preview Proforma
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`Proforma Preview - ${proforma.proformaNo}`}
          onClose={() => setIsOpen(false)}
          documentId="proforma-document"
          filename={`PROFORMA-${proforma.proformaNo}`}
          icon={<Eye className="h-5 w-5 text-[#c10d12]" />}
        >
          <ProformaDocument proforma={proforma} settings={settings} />
        </PreviewContainer>
      )}
    </>
  );
}
