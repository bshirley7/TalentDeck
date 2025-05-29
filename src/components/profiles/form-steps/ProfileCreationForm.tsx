'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { TalentProfileFormData, talentProfileFormSchema } from '@/lib/validation';
import { addProfile } from '@/lib/data';

import { BasicInfoStep } from './BasicInfoStep';
import { SkillsStep } from './SkillsStep';
import { AvailabilityStep } from './AvailabilityStep';
import { EducationStep } from './EducationStep';
import { FormProgress } from './FormProgress';

const STEPS = [
  { id: 'basic', title: 'Basic Information' },
  { id: 'skills', title: 'Skills & Expertise' },
  { id: 'availability', title: 'Availability' },
  { id: 'education', title: 'Education & Certifications' },
];

export function ProfileCreationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileFormSchema),
    defaultValues: {
      name: undefined,
      title: undefined,
      department: undefined,
      hourlyRate: undefined,
      dayRate: undefined,
      yearlySalary: undefined,
      projectRates: {
        weekly: undefined,
        monthly: undefined,
        quarterly: undefined,
        yearly: undefined,
        minimumDuration: undefined,
        maximumDuration: undefined,
        discountPercentage: undefined,
      },
      bio: undefined,
      image: {
        file: undefined,
        preview: undefined,
      },
      contact: {
        email: undefined,
        phone: undefined,
        website: undefined,
        social: {
          linkedin: undefined,
          github: undefined,
          dribbble: undefined,
        },
      },
      skills: [],
      availability: {
        status: undefined,
        nextAvailable: undefined,
        preferredHours: undefined,
        timezone: undefined,
      },
      education: [],
      certifications: [],
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: TalentProfileFormData) => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Handle image upload if present
      if (data.image?.file) {
        const formData = new FormData();
        formData.append('image', data.image.file);
        
        // Upload image first
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { imageUrl } = await imageResponse.json();
        // Store the URL directly in the image field for the database
        (data as any).image = imageUrl;
      } else if (data.image?.preview && !data.image.file) {
        // If we have a preview but no file, use the preview URL (for existing images)
        (data as any).image = data.image.preview;
      } else {
        // No image provided
        (data as any).image = undefined;
      }

      // Create profile with image URL
      await addProfile(data as any);
      // Force a reload of the /profiles page to show the new profile
      router.replace('/profiles');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} onNext={nextStep} />;
      case 1:
        return (
          <SkillsStep form={form} onNext={nextStep} onPrev={prevStep} />
        );
      case 2:
        return (
          <AvailabilityStep
            form={form}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <EducationStep
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <FormProgress steps={STEPS} currentStep={currentStep} />
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}
      {renderStep()}
    </div>
  );
} 