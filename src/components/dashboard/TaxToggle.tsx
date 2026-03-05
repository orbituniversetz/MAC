'use client'

import { Switch } from '@/components/ui/switch';
import { updateProformaTaxStatus } from '@/lib/actions';
import { useTransition } from 'react';

interface TaxToggleProps {
  proformaId: number;
  enabled: boolean;
  disabled?: boolean;
}

export function TaxToggle({ proformaId, enabled, disabled }: TaxToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      await updateProformaTaxStatus(proformaId, checked);
    });
  };

  return (
    <Switch 
      checked={enabled} 
      onCheckedChange={handleToggle}
      disabled={disabled || isPending}
    />
  );
}
