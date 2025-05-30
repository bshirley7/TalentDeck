'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { TalentProfileFormData } from '@/lib/validation';
import { addProfile } from '@/lib/data';
import { Form } from '@/components/ui/form';

import { BasicInfoStep } from './form-steps/BasicInfoStep';
import { SkillsStep } from './form-steps/SkillsStep';
import { AvailabilityStep } from './form-steps/AvailabilityStep';
import { EducationStep } from './form-steps/EducationStep';
import { FormProgress } from './form-steps/FormProgress';

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
    defaultValues: {
      name: '',
      title: '',
      department: '',
      bio: '',
      hourlyRate: undefined,
      dayRate: undefined,
      yearlySalary: undefined,
      image: {
        file: undefined,
        preview: undefined,
      },
      contact: {
        email: '',
        phone: '',
        website: '',
        social: {
          linkedin: '',
          github: '',
          dribbble: '',
        },
      },
      skills: [],
      availability: {
        status: 'Available',
        nextAvailable: '',
        preferredHours: '',
        timezone: '',
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

      // Create a copy of the data for submission
      const submissionData = { ...data };

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
        (submissionData as any).image = imageUrl;
      } else if (data.image?.preview && !data.image.file) {
        // If we have a preview but no file, use the preview URL (for existing images)
        (submissionData as any).image = data.image.preview;
      } else {
        // No image provided
        (submissionData as any).image = undefined;
      }

      // Create profile with image URL
      await addProfile(submissionData as any);
      router.push('/profiles');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    // For the first step, the BasicInfoStep will handle its own validation
    // For other steps, allow progression (they're mostly optional)
    if (currentStep < STEPS.length - 1) {
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
      <Form {...form}>
        {renderStep()}
      </Form>
    </div>
  );
} 