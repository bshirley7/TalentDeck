'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Linkedin, Upload, FileText, Image } from 'lucide-react';

export function LinkedInImport() {
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
      const text = await file.text();
      
      // Extract profile images using regex
      // LinkedIn stores profile images in img tags with specific classes
      const imageRegex = /<img[^>]+class="[^"]*presence-entity__image[^"]*"[^>]+src="([^"]+)"/g;
      const images = new Map();
      let match;
      
      while ((match = imageRegex.exec(text)) !== null) {
        // Get the profile URL from the parent link
        const profileLink = text.substring(
          text.lastIndexOf('<a', match.index),
          text.indexOf('</a>', match.index) + 4
        );
        const profileUrlMatch = profileLink.match(/href="([^"]+)"/);
        if (profileUrlMatch) {
          const profileUrl = profileUrlMatch[1];
          // Clean up the image URL to get the highest quality version
          const imageUrl = match[1].replace(/\/[^/]+$/, '/400x400');
          images.set(profileUrl, imageUrl);
        }
      }

      // TODO: Extract other contact information and combine with images
      console.log('Found profile images:', images);
      
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
          <Linkedin className="h-8 w-8 text-[#0077B5]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Import from LinkedIn</h3>
          <p className="mt-1 text-sm text-gray-600">
            Import your LinkedIn connections by saving your connections page and uploading it here.
            We&apos;ll extract contact information and profile images automatically.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => document.getElementById('linkedin-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <input
                id="linkedin-file"
                type="file"
                accept=".html"
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
              className="bg-[#0077B5] hover:bg-[#006399]"
            >
              {isImporting ? 'Importing...' : 'Import Contacts'}
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>How to get your LinkedIn connections:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Go to your LinkedIn connections page</li>
              <li>Scroll to load all your connections</li>
              <li>Right-click and select &quot;Save Page As...&quot;</li>
              <li>Save as HTML file</li>
              <li>Upload the file here</li>
            </ol>
            <div className="mt-2 flex items-center text-gray-500">
              <Image className="h-4 w-4 mr-2" />
              <span>Profile images will be imported automatically from LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 