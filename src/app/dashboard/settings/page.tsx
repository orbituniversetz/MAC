
import { getSettings, updateSetting } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Building, Save } from 'lucide-react';

export default async function SettingsPage() {
  const settings = await getSettings();

  async function handleSave(formData: FormData) {
    'use server'
    for (const [key, value] of formData.entries()) {
      if (key !== '$ACTION_ID_') {
        await updateSetting(key, value as string);
      }
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Settings</h2>
        <p className="text-muted-foreground">Configure your garage information and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#c10d12]" />
            Garage Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="garage_name">Garage Name</Label>
              <Input id="garage_name" name="garage_name" defaultValue={settings.garage_name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_address">Physical Address</Label>
              <Input id="garage_address" name="garage_address" defaultValue={settings.garage_address} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garage_phone">Contact Phone</Label>
              <Input id="garage_phone" name="garage_phone" defaultValue={settings.garage_phone || '0712 000 000'} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_rate">VAT Rate (%)</Label>
              <Input id="tax_rate" name="tax_rate" type="number" defaultValue={settings.tax_rate || '18'} />
            </div>
            <Button type="submit" className="bg-[#c10d12] hover:bg-[#a00b0f]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
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
