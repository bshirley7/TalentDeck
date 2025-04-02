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
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  bluesky?: string;
  youtube?: string;
  vimeo?: string;
  behance?: string;
  dribbble?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ProfileSkill extends Skill {
  proficiency: ProficiencyLevel;
}

export interface Availability {
  status: 'Available' | 'Busy' | 'Away';
  availableFrom?: string;
  notes?: string;
  nextAvailable?: string;
  preferredHours?: string;
  timezone?: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  department: string;
  title: string;
  image?: string;
  hourlyRate: number;
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
    year: number;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
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