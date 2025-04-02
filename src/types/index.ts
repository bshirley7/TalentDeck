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
  social?: SocialProfile;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ProfileSkill extends Skill {
  proficiency: ProficiencyLevel;
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
}

export interface TalentProfile {
  id: string;
  name: string;
  department: string;
  title: string;
  image?: string;
  hourlyRate: number;
  dayRate: number;
  yearlySalary: number;
  projectRates?: {
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
    minimumDuration: number; // in days
    maximumDuration: number; // in days
    discountPercentage?: number; // for longer projects
  };
  contact: ContactInfo;
  skills: ProfileSkill[];
  availability: Availability;
  bio?: string;
  location?: string;
  yearsOfExperience?: number;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
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