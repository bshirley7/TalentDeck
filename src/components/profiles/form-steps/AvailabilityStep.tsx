'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AvailabilityStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function AvailabilityStep({ form, onNext, onPrev }: AvailabilityStepProps) {
  const { register, formState: { errors } } = form;

  const handleNext = async () => {
    const isValid = await form.trigger(['availability.status', 'availability.availableFrom']);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="status">Availability Status</Label>
          <select
            id="status"
            {...register('availability.status')}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          {errors.availability?.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.availability.status.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="availableFrom">Available From</Label>
          <Input
            id="availableFrom"
            type="date"
            {...register('availability.availableFrom')}
          />
          {errors.availability?.availableFrom && (
            <p className="mt-1 text-sm text-red-600">
              {errors.availability.availableFrom.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('availability.notes')}
            placeholder="Add any additional notes about your availability"
            rows={4}
          />
          {errors.availability?.notes && (
            <p className="mt-1 text-sm text-red-600">
              {errors.availability.notes.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 