'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { InvoiceDocument } from './InvoiceDocument';
import { PreviewContainer } from './PreviewContainer';

interface InvoicePreviewProps {
  invoice: any;
  settings: any;
}

export function InvoicePreview({ invoice, settings }: InvoicePreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button className="bg-[#c10d12] hover:bg-[#a00b0f]" onClick={() => setIsOpen(true)}>
        <Receipt className="mr-2 h-4 w-4" /> Preview & Print
      </Button>

      {isOpen && (
        <PreviewContainer
          title={`Invoice Preview - ${invoice.invoiceNo}`}
          onClose={() => setIsOpen(false)}
          documentId="invoice-document"
          filename={`INVOICE-${invoice.invoiceNo}`}
          icon={<Receipt className="h-5 w-5 text-[#c10d12]" />}
        >
          <InvoiceDocument invoice={invoice} settings={settings} />
        </PreviewContainer>
      )}
    </>
  );
}
