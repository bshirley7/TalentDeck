'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, UploadIcon, XIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File, preview: string) => void;
  preview?: string;
  maxSize?: number;
  accept?: string;
}

export function ImageUpload({
  onUpload,
  preview,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploadProps) {
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file type
      if (!accept.split(',').some(type => file.type === type.trim())) {
        setError('Invalid file type. Please upload a valid image file.');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      onUpload(file, previewUrl);
      setError(null);
    },
    [accept, maxSize, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}),
    maxFiles: 1,
  });

  const handleRemove = () => {
    onUpload(null as any, '');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${preview ? 'bg-gray-50' : 'bg-white'}
          transition-colors hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isDragActive ? (
                  'Drop the image here'
                ) : (
                  <>
                    Drag and drop an image here, or{' '}
                    <span className="text-primary">click to select</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP (max {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 