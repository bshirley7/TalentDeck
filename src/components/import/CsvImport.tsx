'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { FileText, Upload, Download } from 'lucide-react';

// Define our expected fields
const expectedFields = [
  // Profile fields
  { id: 'name', label: 'Full Name', required: true },
  { id: 'title', label: 'Job Title', required: true },
  { id: 'department', label: 'Department', required: true },
  { id: 'bio', label: 'Bio', required: false },
  { id: 'image', label: 'Profile Image URL', required: false },
  { id: 'hourlyRate', label: 'Hourly Rate', required: false },
  { id: 'dayRate', label: 'Day Rate', required: false },
  { id: 'yearlySalary', label: 'Yearly Salary', required: false },
  
  // Contact fields
  { id: 'email', label: 'Email', required: true },
  { id: 'phone', label: 'Phone', required: true },
  { id: 'website', label: 'Website', required: false },
  { id: 'location', label: 'Location', required: false },
  { id: 'linkedin', label: 'LinkedIn URL', required: false },
  { id: 'github', label: 'GitHub URL', required: false },
  
  // Skills (comma-separated)
  { id: 'skills', label: 'Skills (comma-separated)', required: false },
  { id: 'skillCategories', label: 'Skill Categories (comma-separated)', required: false },
  { id: 'skillProficiencies', label: 'Skill Proficiencies (comma-separated)', required: false },
  
  // Availability
  { id: 'availabilityStatus', label: 'Availability Status', required: false },
  { id: 'availableFrom', label: 'Available From (YYYY-MM-DD)', required: false },
  { id: 'nextAvailable', label: 'Next Available (YYYY-MM-DD)', required: false },
  { id: 'preferredHours', label: 'Preferred Hours', required: false },
  { id: 'timezone', label: 'Timezone', required: false },
  { id: 'bookingLeadTime', label: 'Booking Lead Time (days)', required: false },
  { id: 'weeklyHours', label: 'Weekly Hours', required: false },
  { id: 'maxConcurrentProjects', label: 'Max Concurrent Projects', required: false },
  
  // Education (semicolon-separated)
  { id: 'education', label: 'Education (Institution;Degree;Field;StartDate;EndDate)', required: false },
  
  // Certifications (semicolon-separated)
  { id: 'certifications', label: 'Certifications (Name;Issuer;Date;ExpiryDate)', required: false },
];

export function CsvImport() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string[][]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    try {
      const text = await selectedFile.text();
      const rows = text.split('\n').map(row => row.split(','));
      const fileHeaders = rows[0];
      setHeaders(fileHeaders);
      setPreview(rows.slice(1, 6)); // Show first 5 rows as preview
      
      // Try to auto-map headers
      const autoMapping: Record<string, string> = {};
      fileHeaders.forEach(header => {
        const match = expectedFields.find(field => 
          header.toLowerCase().includes(field.id.toLowerCase())
        );
        if (match) {
          autoMapping[match.id] = header;
        }
      });
      setMapping(autoMapping);
    } catch (error) {
      console.error('Failed to parse CSV:', error);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = expectedFields.map(f => f.id).join(',');
    const example = [
      // Profile fields
      'John Doe',
      'Senior Software Engineer',
      'Engineering',
      'Experienced full-stack developer with a passion for building scalable applications',
      'https://example.com/profile.jpg',
      '100',
      '800',
      '150000',
      
      // Contact fields
      'john@example.com',
      '+1234567890',
      'https://johndoe.com',
      'San Francisco, CA',
      'https://linkedin.com/in/johndoe',
      'https://github.com/johndoe',
      
      // Skills
      'JavaScript,React,Node.js,TypeScript',
      'Frontend,Backend,Full Stack',
      'Expert,Advanced,Advanced,Intermediate',
      
      // Availability
      'Available',
      '2024-04-01',
      '2024-12-31',
      '9:00-17:00',
      'America/Los_Angeles',
      '14',
      '40',
      '2',
      
      // Education
      'Stanford University;BS;Computer Science;2015-09;2019-06',
      
      // Certifications
      'AWS Solutions Architect;Amazon;2023-01;2026-01'
    ].join(',');
    
    const csv = `${headers}\n${example}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsImporting(true);
    setImportStatus('Starting import...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setImportStatus(prev => `${prev}\nImport completed successfully!\nProcessed ${result.data.length} contacts.`);
      } else {
        throw new Error(result.error || 'Import failed');
      }
      
    } catch (error: unknown) {
      console.error('Failed to import:', error);
      setImportStatus(prev => `${prev}\nError during import: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <FileText className="h-8 w-8 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Import from CSV</h3>
          <p className="mt-1 text-sm text-gray-600">
            Import contacts from a CSV file. Download our template or use your own format.
            We&apos;ll help you map the fields correctly.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={handleDownloadTemplate}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => document.getElementById('csv-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <input
                id="csv-file"
                type="file"
                accept=".csv"
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

            {headers.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Map Your Fields</h4>
                <div className="space-y-2">
                  {expectedFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-4">
                      <label className="w-32 text-sm text-gray-600">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={mapping[field.id] || ''}
                        onChange={(e) => setMapping({ ...mapping, [field.id]: e.target.value })}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a field</option>
                        {headers.map(header => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {preview.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Preview</h4>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <thead>
                          <tr>
                            {headers.map(header => (
                              <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-t">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2 text-sm text-gray-500">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="w-full"
                  >
                    {isImporting ? 'Importing...' : 'Import Contacts'}
                  </Button>
                </div>

                {importStatus && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {importStatus}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 