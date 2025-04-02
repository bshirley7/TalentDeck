'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EducationStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function EducationStep({ form, onSubmit, onPrev, isLoading }: EducationStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const education = watch('education') || [];
  const certifications = watch('certifications') || [];

  const handleAddEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setValue('education', [...education, newEducation]);
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setValue('education', updatedEducation);
  };

  const handleAddCertification = () => {
    const newCertification = {
      name: '',
      issuer: '',
      date: '',
    };
    setValue('certifications', [...certifications, newCertification]);
  };

  const handleRemoveCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setValue('certifications', updatedCertifications);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <Label>Education</Label>
            <Button type="button" variant="outline" onClick={handleAddEducation}>
              Add Education
            </Button>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="mt-4 space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveEducation(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`institution-${index}`}>Institution</Label>
                  <Input
                    id={`institution-${index}`}
                    {...register(`education.${index}.institution`)}
                  />
                  {errors.education?.[index]?.institution && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.education[index].institution?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`degree-${index}`}>Degree</Label>
                  <Input
                    id={`degree-${index}`}
                    {...register(`education.${index}.degree`)}
                  />
                  {errors.education?.[index]?.degree && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.education[index].degree?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`field-${index}`}>Field of Study</Label>
                  <Input
                    id={`field-${index}`}
                    {...register(`education.${index}.field`)}
                  />
                  {errors.education?.[index]?.field && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.education[index].field?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    type="date"
                    {...register(`education.${index}.startDate`)}
                  />
                  {errors.education?.[index]?.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.education[index].startDate?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    type="date"
                    {...register(`education.${index}.endDate`)}
                  />
                  {errors.education?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.education[index].endDate?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label>Certifications</Label>
            <Button type="button" variant="outline" onClick={handleAddCertification}>
              Add Certification
            </Button>
          </div>

          {certifications.map((cert, index) => (
            <div key={index} className="mt-4 space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Certification {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveCertification(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`certName-${index}`}>Name</Label>
                  <Input
                    id={`certName-${index}`}
                    {...register(`certifications.${index}.name`)}
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.certifications[index].name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`issuer-${index}`}>Issuer</Label>
                  <Input
                    id={`issuer-${index}`}
                    {...register(`certifications.${index}.issuer`)}
                  />
                  {errors.certifications?.[index]?.issuer && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.certifications[index].issuer?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`certDate-${index}`}>Date</Label>
                  <Input
                    id={`certDate-${index}`}
                    type="date"
                    {...register(`certifications.${index}.date`)}
                  />
                  {errors.certifications?.[index]?.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.certifications[index].date?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Creating Profile...' : 'Create Profile'}
        </Button>
      </div>
    </div>
  );
} 