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
  bookingLeadTime: z.number().min(0).optional(),
  currentCommitments: z.array(projectCommitmentSchema).optional(),
  seasonalAvailability: z.array(seasonalAvailabilitySchema).optional(),
  capacity: capacitySchema.optional()
});

// Form validation schema (more flexible)
export const talentProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  dayRate: z.number().min(0, 'Day rate must be positive').optional(),
  yearlySalary: z.number().min(0, 'Yearly salary must be positive').optional(),
  projectRates: z.object({
    weekly: z.number().min(0, 'Weekly rate must be positive'),
    monthly: z.number().min(0, 'Monthly rate must be positive'),
    quarterly: z.number().min(0, 'Quarterly rate must be positive'),
    yearly: z.number().min(0, 'Yearly rate must be positive'),
    minimumDuration: z.number().min(1, 'Minimum duration must be at least 1 day'),
    maximumDuration: z.number().min(1, 'Maximum duration must be at least 1 day'),
    discountPercentage: z.number().min(0).max(100, 'Discount percentage must be between 0 and 100').optional(),
  }).optional(),
  image: z.object({
    file: z.any().optional(),
    preview: z.string().optional(),
  }).optional(),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    website: z.string().url('Invalid URL').optional(),
    social: socialProfileSchema,
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