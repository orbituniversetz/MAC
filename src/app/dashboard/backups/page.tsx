
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BackupsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Backup Manager</h2>
        <p className="text-muted-foreground">Secure your data with manual and automatic backups.</p>
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
              Download a complete copy of your local database. We recommend doing this weekly.
            </p>
            <Button className="w-full bg-black text-white hover:bg-gray-800">
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
              Upload a previously saved backup file. <span className="text-red-600 font-bold underline">Warning:</span> This will overwrite current data.
            </p>
            <Button variant="outline" className="w-full border-[#b0b2b5]">
              Upload Backup File
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-gray-500" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Automatic System Backup</p>
                  <p className="text-[10px] text-muted-foreground">May 24, 2024 - 03:00 AM</p>
                </div>
              </div>
              <Badge variant="secondary">1.2 MB</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 opacity-60">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Manual Backup</p>
                  <p className="text-[10px] text-muted-foreground">May 20, 2024 - 11:45 AM</p>
                </div>
              </div>
              <Badge variant="secondary">1.1 MB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
