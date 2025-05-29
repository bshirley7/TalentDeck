'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { talentProfileFormSchema, type TalentProfileFormData } from '@/lib/validation';
import { TalentProfile } from '@/types';
import { toast } from 'sonner';
import * as React from 'react';

// Import the SkillsStep approach
type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface ProfileFormProps {
  initialData: TalentProfile;
  onSubmit: (data: TalentProfile) => Promise<void>;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const form = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: initialData.name,
      title: initialData.title,
      department: initialData.department,
      hourlyRate: initialData.hourlyRate,
      dayRate: initialData.dayRate,
      yearlySalary: initialData.yearlySalary,
      projectRates: initialData.projectRates,
      image: initialData.image ? { preview: initialData.image } : undefined,
      contact: initialData.contact,
      skills: initialData.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || 'Intermediate'
      })),
      availability: initialData.availability,
      education: initialData.education,
      certifications: initialData.certifications,
    },
  });

  // Skills management (consistent with SkillsStep)
  const skills = form.watch('skills') || [];
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
      id: skillFromDb.id,  // Use the actual database ID
      name: skillFromDb.name,
      category: skillFromDb.category,  // Use the actual database category
      proficiency: 'Intermediate' as ProficiencyLevel,
    };

    form.setValue('skills', [...skills, newSkill]);
    setSearchTerm(''); // Clear search after adding
  }, [skills, form]);

  const removeSkill = React.useCallback((index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    form.setValue('skills', updatedSkills);
  }, [skills, form]);

  const handleFormSubmit = async (data: TalentProfileFormData) => {
    console.log('🎯 ProfileForm.handleFormSubmit called with valid data');
    
    try {
      await onSubmit({
        ...data,
        id: initialData.id,
      } as TalentProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dayRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Rate</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearlySalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yearly Salary</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Availability</h3>
            <FormField
              control={form.control}
              name="availability.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Project">On Project</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Skills Section - Updated to match SkillsStep */}
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
                              form.setValue('skills', updatedSkills);
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
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            onClick={() => {
              console.log('🎯 Save button clicked!');
              console.log('🎯 Form validation state:', form.formState.isValid);
              console.log('🎯 Form errors:', form.formState.errors);
              console.log('🎯 Current form values:', form.getValues());
            }}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 