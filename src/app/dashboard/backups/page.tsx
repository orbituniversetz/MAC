
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { exportDatabase, importDatabase } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function BackupsPage() {
  const { toast } = useToast();

  const handleExport = async () => {
    const result = await exportDatabase();
    if (result.success && result.data && result.filename) {
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${result.data}`;
      link.download = result.filename;
      link.click();
      toast({ title: 'Backup Successful', description: 'Your database has been exported.' });
    } else {
      toast({ variant: 'destructive', title: 'Export Failed', description: result.error });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Warning: This will overwrite ALL current data. Proceed?')) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const result = await importDatabase(base64);
      if (result.success) {
        toast({ title: 'Restore Successful', description: 'Please restart the application to apply changes.' });
      } else {
        toast({ variant: 'destructive', title: 'Restore Failed', description: result.error });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Backup Manager</h2>
        <p className="text-muted-foreground">Secure your garage data locally.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-[#c10d12]" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download a complete copy of your local SQLite database. Keep this safe on an external drive.
            </p>
            <Button onClick={handleExport} className="w-full bg-black text-white hover:bg-gray-800">
              Generate Backup (.sqlite)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-blue-600" />
              Restore Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a previously saved .sqlite file. This will replace all current customers, jobs, and invoices.
            </p>
            <label className="block">
              <span className="sr-only">Choose backup file</span>
              <input type="file" accept=".sqlite,.db" onChange={handleImport} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </label>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-gray-500" />
            Offline Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
            <Database className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-bold">Local Storage Location</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is stored locally in the project's 'local_data' folder. In PWA mode, this data persists across browser restarts. For maximum safety, use the Export feature regularly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
