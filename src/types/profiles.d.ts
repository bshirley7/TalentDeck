declare module '@/data/profiles.json' {
  interface Skill {
    name: string;
    proficiency: string;
    category: string;
    id: string;
  }

  interface Profile {
    id: string;
    name: string;
    title: string;
    department: string;
    image: string;
    bio: string;
    hourlyRate: number;
    dayRate: number;
    yearlySalary: number;
    contact: {
      email: string;
      phone: string;
      website: string;
      location: string;
      social: {
        linkedin: string;
        github: string;
      };
    };
    skills: Skill[];
    availability: {
      status: string;
      availableFrom: string;
      nextAvailable: string;
      preferredHours: string;
      timezone: string;
      bookingLeadTime: number;
      currentCommitments: Array<{
        projectId: string;
        projectName: string;
        role: string;
        startDate: string;
        endDate: string;
        commitmentPercentage: number;
        notes: string;
      }>;
      seasonalAvailability: Array<{
        startDate: string;
        endDate: string;
        status: string;
        notes: string;
      }>;
      capacity: {
        weeklyHours: number;
        maxConcurrentProjects: number;
        preferredProjectDuration: {
          min: number;
          max: number;
        };
      };
    };
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  }

  const data: {
    profiles: Profile[];
  };

  export default data;
} 