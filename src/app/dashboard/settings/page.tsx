import { getSettings, updateSetting } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Building, Save, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const settings = await getSettings();

  async function handleSave(formData: FormData) {
    'use server'
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith('$ACTION_ID_')) {
        await updateSetting(key, value as string);
      }
    }
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Settings</h2>
        <p className="text-muted-foreground">Configure your garage information and payment details.</p>
      </div>

      <form action={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-[#c10d12]" />
                Garage Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Button type="submit" className="bg-[#c10d12] hover:bg-[#a00b0f] size-lg px-8">
            <Save className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <SettingsIcon className="h-5 w-5 text-gray-500" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <p className="font-medium">Auto-generate Job Numbers</p>
              <p className="text-xs text-muted-foreground">Automatically assign the next sequential number.</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Switch UI to dark theme.</p>
            </div>
            <Badge variant="outline">Planned</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
