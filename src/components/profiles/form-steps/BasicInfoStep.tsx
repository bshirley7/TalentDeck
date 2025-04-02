'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';

interface BasicInfoStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
}

export function BasicInfoStep({ form, onNext }: BasicInfoStepProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  const handleNext = async () => {
    const isValid = await form.trigger([
      'name',
      'title',
      'department',
      'contact.email',
      'contact.phone',
      'hourlyRate'
    ]);
    if (isValid) {
      onNext();
    }
  };

  const handleImageUpload = (file: File, preview: string) => {
    setValue('image', { file, preview });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter your job title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="department">Domain</Label>
          <Input
            id="department"
            {...register('department')}
            placeholder="Enter domain expertise i.e. Design, Software Development, Marketing, Sales, etc."
          />
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="1"
            {...register('hourlyRate', { valueAsNumber: true })}
            placeholder="Enter hourly rate"
          />
          {errors.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dayRate">Day Rate ($)</Label>
          <Input
            id="dayRate"
            type="number"
            min="0"
            step="1"
            {...register('dayRate', { valueAsNumber: true })}
            placeholder="Enter day rate"
          />
          {errors.dayRate && (
            <p className="mt-1 text-sm text-red-600">{errors.dayRate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="yearlySalary">Yearly Salary ($)</Label>
          <Input
            id="yearlySalary"
            type="number"
            min="0"
            step="1000"
            {...register('yearlySalary', { valueAsNumber: true })}
            placeholder="Enter expected or estimated yearly salary"
          />
          {errors.yearlySalary && (
            <p className="mt-1 text-sm text-red-600">{errors.yearlySalary.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('contact.email')}
            placeholder="Enter your email"
          />
          {errors.contact?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('contact.phone')}
            placeholder="Enter your phone number"
          />
          {errors.contact?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            type="url"
            {...register('contact.website')}
            placeholder="https://your-website.com"
          />
          {errors.contact?.website && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.website.message}</p>
          )}
        </div>

        <div>
          <Label>Profile Image</Label>
          <ImageUpload
            onUpload={handleImageUpload}
            preview={watch('image.preview')}
            maxSize={5 * 1024 * 1024} // 5MB
            accept="image/jpeg,image/png,image/webp"
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Social Media Profiles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              {...register('contact.social.linkedin')}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.contact?.social?.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.linkedin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              type="url"
              {...register('contact.social.github')}
              placeholder="https://github.com/username"
            />
            {errors.contact?.social?.github && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.github.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              type="url"
              {...register('contact.social.twitter')}
              placeholder="https://twitter.com/username"
            />
            {errors.contact?.social?.twitter && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.twitter.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="behance">Behance</Label>
            <Input
              id="behance"
              type="url"
              {...register('contact.social.behance')}
              placeholder="https://behance.net/username"
            />
            {errors.contact?.social?.behance && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.behance.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dribbble">Dribbble</Label>
            <Input
              id="dribbble"
              type="url"
              {...register('contact.social.dribbble')}
              placeholder="https://dribbble.com/username"
            />
            {errors.contact?.social?.dribbble && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.dribbble.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              {...register('contact.social.instagram')}
              placeholder="https://instagram.com/username"
            />
            {errors.contact?.social?.instagram && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.instagram.message}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 