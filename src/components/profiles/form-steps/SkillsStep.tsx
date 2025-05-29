'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface SkillsStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function SkillsStep({ form, onNext, onPrev }: SkillsStepProps) {
  const { watch, setValue } = form;
  const skills = watch('skills') || [];

  // Get all available skills from database API
  const [availableSkills, setAvailableSkills] = React.useState<Array<{ id: string; name: string; category: string }>>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const skillsData = await response.json();
        setAvailableSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setAvailableSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Filter skills based on search term
  const filteredSkills = React.useMemo(() => {
    if (!searchTerm) return availableSkills.slice(0, 20); // Show first 20 skills
    return availableSkills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20);
  }, [availableSkills, searchTerm]);

  const addSkill = React.useCallback((skillFromDb: { id: string; name: string; category: string }) => {
    const existingSkill = skills.find(s => s.id === skillFromDb.id);
    if (existingSkill) return; // Don't add duplicates

    const newSkill = {
      id: skillFromDb.id,  // ← Use the actual database ID
      name: skillFromDb.name,
      category: skillFromDb.category,  // ← Use the actual database category
      proficiency: 'Intermediate' as ProficiencyLevel,
    };

    setValue('skills', [...skills, newSkill]);
    setSearchTerm(''); // Clear search after adding
  }, [skills, setValue]);

  const removeSkill = React.useCallback((index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setValue('skills', updatedSkills);
  }, [skills, setValue]);

  const handleNext = React.useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-900">
            Skills & Expertise
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Search for skills and click to add them to your profile.
          </p>
          
          {isLoadingSkills ? (
            <div className="flex items-center justify-center h-10 text-gray-500">
              Loading skills...
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search for skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              {searchTerm && filteredSkills.length > 0 && (
                <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      onClick={() => addSkill(skill)}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700">Selected Skills:</Label>
            <div className="mt-2 space-y-2">
              {skills.map((skill, index) => (
                <div key={`${skill.id}-${index}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <span className="flex-1 font-medium">{skill.name}</span>
                  <div className="flex gap-2">
                    <select
                      value={skill.proficiency}
                      onChange={(e) => {
                        const updatedSkills = [...skills];
                        updatedSkills[index] = { ...skill, proficiency: e.target.value as ProficiencyLevel };
                        setValue('skills', updatedSkills);
                      }}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-gradient-primary hover:bg-gradient-primary-hover text-white transition-all duration-200">Next</Button>
      </div>
    </div>
  );
} 