'use client';

import * as React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TalentProfile, TalentProfileFormData, talentProfileFormSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { BasicInfoStep } from './form-steps/BasicInfoStep';
import { SkillsStep } from './form-steps/SkillsStep';
import { AvailabilityStep } from './form-steps/AvailabilityStep';
import { EducationStep } from './form-steps/EducationStep';

interface ProfileEditFormProps {
  initialData: TalentProfile;
  onSubmit: (data: TalentProfile) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProfileEditForm({ initialData, onSubmit, isSubmitting = false }: ProfileEditFormProps) {
  const [activeTab, setActiveTab] = React.useState('basic');

  const form = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileFormSchema),
    defaultValues: {
      name: initialData.name,
      title: initialData.title,
      department: initialData.department,
      hourlyRate: initialData.hourlyRate,
      dayRate: initialData.dayRate,
      yearlySalary: initialData.yearlySalary,
      projectRates: initialData.projectRates,
      bio: initialData.bio || '',
      image: initialData.image ? { preview: initialData.image } : undefined,
      contact: initialData.contact,
      skills: initialData.skills?.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || 'Intermediate'
      })) || [],
      availability: initialData.availability,
      education: initialData.education,
      certifications: initialData.certifications,
      notes: initialData.notes || [],
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: TalentProfileFormData) => {
    try {
      // Convert form data back to TalentProfile format
      let imageValue = initialData.image; // Keep existing image by default
      
      if (data.image?.file) {
        // Handle new image upload
        const formData = new FormData();
        formData.append('image', data.image.file);
        
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const { imageUrl } = await imageResponse.json();
          imageValue = imageUrl;
        }
      } else if (data.image?.preview && data.image.preview !== initialData.image) {
        // If preview is different from initial, use the new preview
        imageValue = data.image.preview;
      }

      const updatedProfile: TalentProfile = {
        ...data,
        id: initialData.id,
        image: imageValue,
      };

      await onSubmit(updatedProfile);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const tabs = [
    { id: 'basic', title: 'Basic Info', icon: '👤' },
    { id: 'skills', title: 'Skills', icon: '🎯' },
    { id: 'availability', title: 'Availability', icon: '📅' },
    { id: 'education', title: 'Education', icon: '🎓' },
  ];

  const renderActiveStep = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicInfoStep 
            form={form as UseFormReturn<TalentProfileFormData>} 
            onNext={() => setActiveTab('skills')} 
          />
        );
      case 'skills':
        return (
          <SkillsStep 
            form={form as UseFormReturn<TalentProfileFormData>} 
            onNext={() => setActiveTab('availability')}
            onPrev={() => setActiveTab('basic')}
          />
        );
      case 'availability':
        return (
          <AvailabilityStep 
            form={form as UseFormReturn<TalentProfileFormData>} 
            onNext={() => setActiveTab('education')}
            onPrev={() => setActiveTab('skills')}
          />
        );
      case 'education':
        return (
          <EducationStep 
            form={form as UseFormReturn<TalentProfileFormData>} 
            onSubmit={form.handleSubmit(handleFormSubmit)}
            onPrev={() => setActiveTab('availability')}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">
            {renderActiveStep()}
          </div>

          {/* Global Save Button - shown on all tabs except notes (which has its own) */}
          {activeTab !== 'notes' && (
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <Button 
                onClick={form.handleSubmit(handleFormSubmit)}
                disabled={isSubmitting}
                className="px-6 py-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Form>
  );
} 