import { z } from 'zod';

export const socialProfileSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  bluesky: z.string().url().optional(),
  youtube: z.string().url().optional(),
  vimeo: z.string().url().optional(),
  behance: z.string().url().optional(),
  dribbble: z.string().url().optional(),
});

export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  website: z.string().url().optional(),
  social: socialProfileSchema,
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
});

export const availabilitySchema = z.object({
  status: z.enum(['Available', 'Busy', 'Away']),
  availableFrom: z.string().optional(),
  notes: z.string().optional(),
});

// Form validation schema (more flexible)
export const talentProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    website: z.string().url('Invalid URL').optional(),
    social: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional(),
      twitter: z.string().url('Invalid Twitter URL').optional(),
      github: z.string().url('Invalid GitHub URL').optional(),
      dribbble: z.string().url('Invalid Dribbble URL').optional(),
    }).optional(),
  }),
  skills: z.array(skillSchema),
  availability: availabilitySchema,
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    description: z.string().optional(),
  })).optional(),
});

// API validation schema (stricter)
export const talentProfileSchema = talentProfileFormSchema.extend({
  id: z.string(),
});

export type TalentProfile = z.infer<typeof talentProfileSchema>;
export type TalentProfileFormData = z.infer<typeof talentProfileFormSchema>; 