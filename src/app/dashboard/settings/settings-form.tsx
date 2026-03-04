'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building, Save, CreditCard, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { updateAllSettings } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormProps {
  settings: any;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [logoBase64, setLogoBase64] = useState(settings.garage_logo || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Logo file is too large. Please select an image under 1MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      const updates: Record<string, string> = {};
      
      for (const [key, value] of formData.entries()) {
        if (!key.startsWith('$ACTION_ID_')) {
          updates[key] = value as string;
        }
      }
      
      updates['garage_logo'] = logoBase64;

      await updateAllSettings(updates);
      toast({
        title: "Settings Saved",
        description: "Your garage configuration has been updated successfully."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-[#c10d12]" />
              Garage Profile & Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50 mb-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-white flex items-center justify-center">
                {logoBase64 ? (
                  <Image src={logoBase64} alt="Garage Logo" fill className="object-contain" unoptimized />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-300" />
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="cursor-pointer">
                  <span className="flex items-center gap-2 bg-white border px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm">
                    <Upload className="h-4 w-4" /> Upload Logo
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </label>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">PNG or JPG, max 1MB</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="garage_name">Garage Name</Label>
              <Input id="garage_name" name="garage_name" defaultValue={settings.garage_name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_mailbox">P.O. Box / Mail Box</Label>
              <Input id="garage_mailbox" name="garage_mailbox" defaultValue={settings.garage_mailbox} placeholder="e.g. P.O. Box 7005, Arusha" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_address">Physical Address</Label>
              <Input id="garage_address" name="garage_address" defaultValue={settings.garage_address} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_phone">Contact Phone</Label>
              <Input id="garage_phone" name="garage_phone" defaultValue={settings.garage_phone} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_tin">TIN Number</Label>
              <Input id="garage_tin" name="garage_tin" defaultValue={settings.garage_tin} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_rate">VAT Rate (%)</Label>
              <Input id="tax_rate" name="tax_rate" type="number" defaultValue={settings.tax_rate} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Bank & Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input id="bank_name" name="bank_name" defaultValue={settings.bank_name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_branch">Branch Name</Label>
              <Input id="bank_branch" name="bank_branch" defaultValue={settings.bank_branch} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_account_name">Account Name</Label>
              <Input id="bank_account_name" name="bank_account_name" defaultValue={settings.bank_account_name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_account_number">Account Number</Label>
              <Input id="bank_account_number" name="bank_account_number" defaultValue={settings.bank_account_number} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_swift">SWIFT Code</Label>
              <Input id="bank_swift" name="bank_swift" defaultValue={settings.bank_swift} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-[#c10d12] hover:bg-[#a00b0f] size-lg px-8"
        >
          <Save className="mr-2 h-4 w-4" /> 
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </form>
  );
}
