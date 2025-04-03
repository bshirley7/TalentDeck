import { z } from 'zod';

const capacitySchema = z.object({
  weeklyHours: z.number().min(0),
  maxConcurrentProjects: z.number().min(1),
  preferredProjectDuration: z.object({
    min: z.number().min(1),
    max: z.number().min(1),
  }),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Domain is required'),
  bio: z.string().optional(),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    website: z.string().url('Invalid website URL').optional(),
    location: z.string().optional(),
    social: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional(),
      github: z.string().url('Invalid GitHub URL').optional(),
      dribbble: z.string().url('Invalid Dribbble URL').optional(),
    }).default({}),
  }),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Skill name is required'),
    category: z.string().min(1, 'Category is required'),
    proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    field: z.string().min(1, 'Field is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    expiryDate: z.string().optional(),
  })).optional(),
  availability: z.object({
    status: z.enum(['Available', 'On Project', 'On Leave', 'Limited', 'Unavailable']),
    nextAvailable: z.string().optional(),
    preferredHours: z.string().optional(),
    timezone: z.string().optional(),
    capacity: capacitySchema.optional(),
  }),
  hourlyRate: z.number().min(0),
  dayRate: z.number().min(0),
  yearlySalary: z.number().min(0),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 