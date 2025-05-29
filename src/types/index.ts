export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SocialProfile {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  bluesky?: string;
  youtube?: string;
  vimeo?: string;
  behance?: string;
  dribbble?: string;
  github?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  location?: string;
  social?: SocialProfile;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ProfileSkill {
  id: string;
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectCommitment {
  projectId: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  commitmentPercentage: number;
  notes?: string;
}

export interface SeasonalAvailability {
  startDate: string;
  endDate: string;
  status: 'Available' | 'Limited' | 'Unavailable';
  notes?: string;
}

export interface Capacity {
  weeklyHours: number;
  maxConcurrentProjects: number;
  preferredProjectDuration: {
    min: number;
    max: number;
  };
}

export interface Availability {
  status: 'Available' | 'On Project' | 'On Leave' | 'Limited' | 'Unavailable';
  availableFrom?: string;
  nextAvailable?: string;
  preferredHours?: string;
  timezone?: string;
  bookingLeadTime?: number;
  currentCommitments?: ProjectCommitment[];
  seasonalAvailability?: SeasonalAvailability[];
  capacity?: Capacity;
  hours?: string;
}

export interface Experience {
  id?: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  skillsUsed?: string[];
  achievements?: string[];
}

export interface TalentProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  bio?: string;
  image?: string;
  contact: ContactInfo;
  skills?: ProfileSkill[];
  availability: Availability;
  hourlyRate?: number;
  dayRate?: number;
  yearlySalary?: number;
  projectRates?: {
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
    minimumDuration: number; // in days
    maximumDuration: number; // in days
    discountPercentage?: number; // for longer projects
  };
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    period?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}

export interface SkillsDirectory {
  id: string;
  name: string;
  category: string;
  count: number;
}

export interface DataStore {
  profiles: TalentProfile[];
  skills: SkillsDirectory[];
}

export interface TalentProfileFormData {
  name: string;
  title: string;
  department: string;
  bio?: string;
  hourlyRate?: number;
  dayRate?: number;
  yearlySalary?: number;
  image?: {
    file?: File;
    preview?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    social?: {
      linkedin?: string;
      github?: string;
      dribbble?: string;
    };
  };
  skills?: ProfileSkill[];
  availability?: {
    status?: 'Available' | 'On Project' | 'On Leave' | 'Limited' | 'Unavailable';
    availableFrom?: string;
    nextAvailable?: string;
    preferredHours?: string;
    timezone?: string;
    bookingLeadTime?: number;
    capacity?: {
      weeklyHours?: number;
      maxConcurrentProjects?: number;
      preferredProjectDuration?: {
        min?: number;
        max?: number;
      };
    };
  };
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    description?: string;
  }>;
} 