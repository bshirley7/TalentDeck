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
  id: z.string(),
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

export const availabilitySchema = z.object({
  status: z.enum(['Available', 'Busy', 'Away']),
  availableFrom: z.string().optional(),
  notes: z.string().optional(),
});

export const talentProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  department: z.string().min(1),
  title: z.string().min(1),
  contact: contactInfoSchema,
  skills: z.array(skillSchema),
  availability: availabilitySchema,
});

export type TalentProfileFormData = z.infer<typeof talentProfileSchema>; 