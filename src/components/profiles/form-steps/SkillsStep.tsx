'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface SkillsStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function SkillsStep({ form, onNext, onPrev }: SkillsStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const skills = watch('skills') || [];

  const handleAddSkill = () => {
    const newSkill = {
      name: '',
      proficiency: 'Intermediate' as ProficiencyLevel,
      category: 'Technical',
    };
    setValue('skills', [...skills, newSkill]);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setValue('skills', updatedSkills);
  };

  const handleNext = async () => {
    const isValid = await form.trigger('skills');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Skills</Label>
          <Button type="button" variant="outline" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </div>

        {skills.map((skill, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <Input
                {...register(`skills.${index}.name`)}
                placeholder="Skill name"
              />
              {errors.skills?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.skills[index].name?.message}
                </p>
              )}
            </div>
            <div className="w-32">
              <select
                {...register(`skills.${index}.proficiency`)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="w-32">
              <select
                {...register(`skills.${index}.category`)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Domain">Domain</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleRemoveSkill(index)}
            >
              Remove
            </Button>
          </div>
        ))}
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