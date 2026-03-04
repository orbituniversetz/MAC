
import { getSettings } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Settings</h2>
        <p className="text-muted-foreground">Configure your garage information, logo, and payment details.</p>
      </div>

      <SettingsForm settings={settings} />

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
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Enabled</Badge>
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
