'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TalentProfileFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoStepProps {
  form: UseFormReturn<TalentProfileFormData>;
  onNext: () => void;
}

export function BasicInfoStep({ form, onNext }: BasicInfoStepProps) {
  const { register, formState: { errors }, setValue, watch, control, trigger } = form;
  const [domains, setDomains] = React.useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = React.useState(true);
  const [customDomain, setCustomDomain] = React.useState('');
  const [isAddingDomain, setIsAddingDomain] = React.useState(false);
  
  const selectedDepartment = watch('department');
  const showCustomInput = selectedDepartment === 'Other';

  // Fetch domains from API on component mount
  React.useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('/api/domains');
        if (response.ok) {
          const domainsData = await response.json();
          setDomains(domainsData);
        } else {
          console.error('Failed to fetch domains');
          // Fallback to default domains
          setDomains([
            'Software Development',
            'Design', 
            'Product Management',
            'Marketing',
            'Sales',
            'Operations',
            'Consulting',
            'Content Creation',
            'Data Science',
            'Quality Assurance'
          ]);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
        // Fallback to default domains
        setDomains([
          'Software Development',
          'Design', 
          'Product Management',
          'Marketing',
          'Sales',
          'Operations',
          'Consulting',
          'Content Creation',
          'Data Science',
          'Quality Assurance'
        ]);
      } finally {
        setLoadingDomains(false);
      }
    };

    fetchDomains();
  }, []);

  const handleAddCustomDomain = async () => {
    if (!customDomain.trim()) return;

    setIsAddingDomain(true);
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: customDomain.trim() }),
      });

      if (response.ok) {
        const newDomainName = customDomain.trim();
        
        // Update domains list
        setDomains(prev => [...prev, newDomainName].sort());
        
        // Select the new domain
        setValue('department', newDomainName, { shouldValidate: true });
        
        // Clear custom input
        setCustomDomain('');
        
        console.log('✅ Domain added successfully:', newDomainName);
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          // Domain already exists, just select it
          setValue('department', customDomain.trim(), { shouldValidate: true });
          setCustomDomain('');
        } else {
          console.error('Failed to add domain:', errorData.error);
          alert('Failed to add domain: ' + errorData.error);
        }
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      alert('Failed to add domain. Please try again.');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleNext = async () => {
    // If user is adding a custom domain, handle it first
    if (showCustomInput && customDomain.trim()) {
      await handleAddCustomDomain();
      return; // Wait for domain to be added, then user can click Next again
    }
    
    // Validate the required fields for this step
    const isValid = await trigger(['name', 'title', 'department']);
    if (isValid) {
      onNext();
    }
  };

  const handleImageUpload = (file: File, preview: string) => {
    setValue('image', { file, preview }, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter full name" 
                  {...field} 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Job Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Senior Software Engineer" 
                  {...field} 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem className={showCustomInput ? "sm:col-span-2" : ""}>
              <FormLabel className="text-sm font-medium text-gray-900">
                Domain <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <SelectValue placeholder={loadingDomains ? "Loading domains..." : "Select domain"} />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other (Add Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {showCustomInput && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom domain (e.g., Cybersecurity, Finance, etc.)"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomDomain();
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        onClick={handleAddCustomDomain}
                        disabled={!customDomain.trim() || isAddingDomain}
                        size="sm"
                      >
                        {isAddingDomain ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-600 text-sm mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief professional bio or description" 
                  {...field} 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  rows={4}
                />
              </FormControl>
              <FormMessage className="text-red-600 text-sm mt-1" />
            </FormItem>
          )}
        />

        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="1"
            {...register('hourlyRate', { valueAsNumber: true })}
            placeholder="Enter hourly rate"
          />
          {errors.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dayRate">Day Rate ($)</Label>
          <Input
            id="dayRate"
            type="number"
            min="0"
            step="1"
            {...register('dayRate', { valueAsNumber: true })}
            placeholder="Enter day rate"
          />
          {errors.dayRate && (
            <p className="mt-1 text-sm text-red-600">{errors.dayRate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="yearlySalary">Yearly Salary ($)</Label>
          <Input
            id="yearlySalary"
            type="number"
            min="0"
            step="1000"
            {...register('yearlySalary', { valueAsNumber: true })}
            placeholder="Enter expected or estimated yearly salary"
          />
          {errors.yearlySalary && (
            <p className="mt-1 text-sm text-red-600">{errors.yearlySalary.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('contact.email')}
            placeholder="Enter your email"
          />
          {errors.contact?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('contact.phone')}
            placeholder="Enter your phone number"
          />
          {errors.contact?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            type="url"
            {...register('contact.website')}
            placeholder="https://your-website.com"
          />
          {errors.contact?.website && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.website.message}</p>
          )}
        </div>

        <div>
          <Label>Profile Image</Label>
          <ImageUpload
            onUpload={handleImageUpload}
            preview={watch('image.preview')}
            maxSize={5 * 1024 * 1024} // 5MB
            accept="image/jpeg,image/png,image/webp"
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Social Media Profiles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              {...register('contact.social.linkedin')}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.contact?.social?.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.linkedin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              type="url"
              {...register('contact.social.github')}
              placeholder="https://github.com/username"
            />
            {errors.contact?.social?.github && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.github.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dribbble">Dribbble</Label>
            <Input
              id="dribbble"
              type="url"
              {...register('contact.social.dribbble')}
              placeholder="https://dribbble.com/username"
            />
            {errors.contact?.social?.dribbble && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.social.dribbble.message}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 