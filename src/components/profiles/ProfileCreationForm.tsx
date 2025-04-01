'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { TalentProfileFormData, talentProfileFormSchema } from '@/lib/validation';

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

  const form = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileFormSchema),
    defaultValues: {
      name: '',
      title: '',
      department: '',
      contact: {
        email: '',
        phone: '',
        website: '',
      },
      skills: [],
      availability: {
        status: 'Available',
        availableFrom: '',
        notes: '',
      },
      education: [],
      certifications: [],
    },
  });

  const onSubmit = async (data: TalentProfileFormData) => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement profile creation API call
      console.log('Form data:', data);
      router.push('/profiles');
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
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
      {renderStep()}
    </div>
  );
} 