'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Upload, FileText } from 'lucide-react';

export function EmailImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsImporting(true);
    try {
      // TODO: Implement file parsing logic
      // This would parse CSV/vCard files from email exports
      console.log('Importing file:', file.name);
    } catch (error) {
      console.error('Failed to import:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Mail className="h-8 w-8 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Import from Email</h3>
          <p className="mt-1 text-sm text-gray-600">
            Import your contacts from exported email contact files.
            We support CSV and vCard formats from most email clients.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => document.getElementById('email-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <input
                id="email-file"
                type="file"
                accept=".csv,.vcf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <span className="text-sm text-gray-600 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {file.name}
                </span>
              )}
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
              variant="default"
            >
              {isImporting ? 'Importing...' : 'Import Contacts'}
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>How to export contacts from your email:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Gmail:</strong> Export contacts as CSV from Google Contacts</li>
              <li><strong>Outlook:</strong> Export contacts as CSV from People app</li>
              <li><strong>Apple Mail:</strong> Export contacts as vCard from Contacts app</li>
              <li><strong>Other:</strong> Most email clients support CSV or vCard export</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
} 