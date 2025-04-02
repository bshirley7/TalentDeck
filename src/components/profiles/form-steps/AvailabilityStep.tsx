'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface AvailabilityStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function AvailabilityStep({ form, onNext, onPrev }: AvailabilityStepProps) {
  const { register, formState: { errors } } = form;

  const handleNext = async () => {
    const isValid = await form.trigger([
      'availability.status',
      'availability.availableFrom',
      'availability.capacity.weeklyHours',
      'availability.capacity.maxConcurrentProjects'
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Basic Availability</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Availability Status</Label>
            <select
              id="status"
              {...register('availability.status')}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="Available">Available</option>
              <option value="On Project">On Project</option>
              <option value="On Leave">On Leave</option>
              <option value="Limited">Limited</option>
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
            <Label htmlFor="nextAvailable">Next Available Date</Label>
            <Input
              id="nextAvailable"
              type="date"
              {...register('availability.nextAvailable')}
            />
            {errors.availability?.nextAvailable && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.nextAvailable.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="preferredHours">Preferred Hours</Label>
            <Input
              id="preferredHours"
              placeholder="e.g., 9 AM - 5 PM EST"
              {...register('availability.preferredHours')}
            />
            {errors.availability?.preferredHours && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.preferredHours.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              placeholder="e.g., EST, PST"
              {...register('availability.timezone')}
            />
            {errors.availability?.timezone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.timezone.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Capacity & Booking</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="weeklyHours">Weekly Available Hours</Label>
            <Input
              id="weeklyHours"
              type="number"
              min="0"
              max="168"
              {...register('availability.capacity.weeklyHours')}
            />
            {errors.availability?.capacity?.weeklyHours && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.capacity.weeklyHours.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxConcurrentProjects">Maximum Concurrent Projects</Label>
            <Input
              id="maxConcurrentProjects"
              type="number"
              min="1"
              {...register('availability.capacity.maxConcurrentProjects')}
            />
            {errors.availability?.capacity?.maxConcurrentProjects && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.capacity.maxConcurrentProjects.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bookingLeadTime">Booking Lead Time (days)</Label>
            <Input
              id="bookingLeadTime"
              type="number"
              min="0"
              {...register('availability.bookingLeadTime')}
            />
            {errors.availability?.bookingLeadTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.bookingLeadTime.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Project Duration Preferences</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="minDuration">Minimum Project Duration (days)</Label>
            <Input
              id="minDuration"
              type="number"
              min="1"
              {...register('availability.capacity.preferredProjectDuration.min')}
            />
            {errors.availability?.capacity?.preferredProjectDuration?.min && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.capacity.preferredProjectDuration.min.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxDuration">Maximum Project Duration (days)</Label>
            <Input
              id="maxDuration"
              type="number"
              min="1"
              {...register('availability.capacity.preferredProjectDuration.max')}
            />
            {errors.availability?.capacity?.preferredProjectDuration?.max && (
              <p className="mt-1 text-sm text-red-600">
                {errors.availability.capacity.preferredProjectDuration.max.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 