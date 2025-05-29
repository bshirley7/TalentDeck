import { z } from 'zod';

export const socialProfileSchema = z.object({
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  twitter: z.string().url('Invalid Twitter URL').optional(),
  facebook: z.string().url('Invalid Facebook URL').optional(),
  instagram: z.string().url('Invalid Instagram URL').optional(),
  tiktok: z.string().url('Invalid TikTok URL').optional(),
  bluesky: z.string().url('Invalid Bluesky URL').optional(),
  youtube: z.string().url('Invalid YouTube URL').optional(),
  vimeo: z.string().url('Invalid Vimeo URL').optional(),
  behance: z.string().url('Invalid Behance URL').optional(),
  dribbble: z.string().url('Invalid Dribbble URL').optional(),
  github: z.string().url('Invalid GitHub URL').optional(),
  website: z.string().url('Invalid Website URL').optional(),
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
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
});

export const projectCommitmentSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  commitmentPercentage: z.number().min(0).max(100),
  notes: z.string().optional()
});

export const seasonalAvailabilitySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['Available', 'Limited', 'Unavailable']),
  notes: z.string().optional()
});

export const capacitySchema = z.object({
  weeklyHours: z.number().min(0).max(168),
  maxConcurrentProjects: z.number().min(1),
  preferredProjectDuration: z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  }).refine(data => data.max >= data.min, {
    message: "Maximum duration must be greater than or equal to minimum duration"
  })
});

export const availabilitySchema = z.object({
  status: z.enum(['Available', 'On Project', 'On Leave', 'Limited', 'Unavailable']),
  availableFrom: z.string().optional(),
  nextAvailable: z.string().optional(),
  preferredHours: z.string().optional(),
  timezone: z.string().optional(),
  bookingLeadTime: z.preprocess(
    (val) => (val === '' || val === null || val === undefined) ? undefined : Number(val),
    z.number().min(0).optional()
  ),
  currentCommitments: z.array(projectCommitmentSchema).optional(),
  seasonalAvailability: z.array(seasonalAvailabilitySchema).optional(),
  capacity: capacitySchema.optional()
});

const preprocessString = (val: unknown) => {
  if (val === '' || val === null || val === undefined) return undefined;
  return val;
};

const preprocessNumber = (val: unknown) => (val === '' || val === null || Number.isNaN(val) ? undefined : val);

// Form validation schema (more flexible)
export const talentProfileFormSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Domain is required'),
  bio: z.string().optional(),
  hourlyRate: z.preprocess(preprocessNumber, z.number().min(0, 'Hourly rate must be positive').optional()),
  dayRate: z.preprocess(preprocessNumber, z.number().min(0, 'Day rate must be positive').optional()),
  yearlySalary: z.preprocess(preprocessNumber, z.number().min(0, 'Yearly salary must be positive').optional()),
  projectRates: z.object({
    weekly: z.preprocess(preprocessNumber, z.number().min(0, 'Weekly rate must be positive').optional()),
    monthly: z.preprocess(preprocessNumber, z.number().min(0, 'Monthly rate must be positive').optional()),
    quarterly: z.preprocess(preprocessNumber, z.number().min(0, 'Quarterly rate must be positive').optional()),
    yearly: z.preprocess(preprocessNumber, z.number().min(0, 'Yearly rate must be positive').optional()),
    minimumDuration: z.preprocess(preprocessNumber, z.number().min(1, 'Minimum duration must be at least 1 day').optional()),
    maximumDuration: z.preprocess(preprocessNumber, z.number().min(1, 'Maximum duration must be at least 1 day').optional()),
    discountPercentage: z.preprocess(preprocessNumber, z.number().min(0).max(100, 'Discount percentage must be between 0 and 100').optional()),
  }).optional(),
  image: z.union([
    z.string().optional(), // For URL strings
    z.object({
      file: z.any().optional(),
      preview: z.string().optional(),
    }).optional(),
    z.null(),
  ]).optional(),
  contact: z.object({
    email: z.string()
      .optional()
      .refine(val => !val || val.trim() === '' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), {
        message: 'Invalid email address',
      }),
    phone: z.string()
      .optional()
      .refine(val => !val || val.trim() === '' || val.replace(/\D/g, '').length >= 10, {
        message: 'Phone number must be at least 10 digits',
      }),
    website: z.string()
      .optional()
      .refine(val => !val || val.trim() === '' || /^https?:\/\/.+\..+/.test(val), {
        message: 'Invalid URL',
      }),
    location: z.string().optional(),
    social: z.object({
      linkedin: z.string()
        .optional()
        .refine(val => !val || val.trim() === '' || /^https?:\/\/.+\..+/.test(val), {
          message: 'Invalid LinkedIn URL',
        }),
      github: z.string()
        .optional()
        .refine(val => !val || val.trim() === '' || /^https?:\/\/.+\..+/.test(val), {
          message: 'Invalid GitHub URL',
        }),
      dribbble: z.string()
        .optional()
        .refine(val => !val || val.trim() === '' || /^https?:\/\/.+\..+/.test(val), {
          message: 'Invalid Dribbble URL',
        }),
    }).optional(),
  }).optional(),
  skills: z.array(skillSchema).optional(),
  availability: z.object({
    status: z.enum(['Available', 'On Project', 'On Leave', 'Limited', 'Unavailable']).optional(),
    availableFrom: z.preprocess(preprocessString, z.string().optional()),
    nextAvailable: z.preprocess(preprocessString, z.string().optional()),
    preferredHours: z.preprocess(preprocessString, z.string().optional()),
    timezone: z.preprocess(preprocessString, z.string().optional()),
    bookingLeadTime: z.preprocess(preprocessNumber, z.number().min(0).optional()),
    currentCommitments: z.array(z.any()).optional(),
    seasonalAvailability: z.array(z.any()).optional(),
    capacity: z.object({
      weeklyHours: z.preprocess(preprocessNumber, z.number().min(0).max(168).optional()),
      maxConcurrentProjects: z.preprocess(preprocessNumber, z.number().min(1).optional()),
      preferredProjectDuration: z.object({
        min: z.preprocess(preprocessNumber, z.number().min(1).optional()),
        max: z.preprocess(preprocessNumber, z.number().min(1).optional()),
      }).refine(data => data.max === undefined || data.min === undefined || data.max >= data.min, {
        message: "Maximum duration must be greater than or equal to minimum duration"
      }).optional(),
    }).optional(),
  }).optional(),
  education: z.array(z.object({
    institution: z.string().transform(val => val === '' ? undefined : val).optional(),
    degree: z.string().transform(val => val === '' ? undefined : val).optional(),
    field: z.string().transform(val => val === '' ? undefined : val).optional(),
    startDate: z.string().transform(val => val === '' ? undefined : val).optional(),
    endDate: z.string().transform(val => val === '' ? undefined : val).optional(),
    description: z.string().transform(val => val === '' ? undefined : val).optional(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string().transform(val => val === '' ? undefined : val).optional(),
    issuer: z.string().transform(val => val === '' ? undefined : val).optional(),
    date: z.string().transform(val => val === '' ? undefined : val).optional(),
    description: z.string().transform(val => val === '' ? undefined : val).optional(),
  })).optional(),
});

// API validation schema (stricter)
export const talentProfileSchema = talentProfileFormSchema.extend({
  id: z.string(),
});

// Type inference from schema
export type TalentProfileFormData = z.infer<typeof talentProfileFormSchema>;
export type TalentProfile = z.infer<typeof talentProfileSchema>; 