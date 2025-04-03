export interface Capacity {
  weeklyHours: number;
  maxConcurrentProjects: number;
  preferredProjectDuration: {
    min: number;
    max: number;
  };
}

export interface TalentProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  bio?: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    location?: string;
    social?: {
      linkedin?: string;
      github?: string;
      dribbble?: string;
    };
  };
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  education?: Array<{
    degree: string;
    institution: string;
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
  availability: {
    status: 'Available' | 'On Project' | 'On Leave' | 'Limited' | 'Unavailable';
    nextAvailable?: string;
    preferredHours?: string;
    timezone?: string;
    capacity?: Capacity;
  };
  hourlyRate: number;
  dayRate: number;
  yearlySalary: number;
} 