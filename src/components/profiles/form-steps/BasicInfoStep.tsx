'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
}

export function BasicInfoStep({ form, onNext }: BasicInfoStepProps) {
  const { register, formState: { errors } } = form;

  const handleNext = async () => {
    const isValid = await form.trigger(['name', 'title', 'department', 'contact.email', 'contact.phone']);
    if (isValid) {
      onNext();
    }
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
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register('department')}
            placeholder="Enter your department"
          />
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
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
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 