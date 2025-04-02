import * as fs from 'fs';
import * as path from 'path';
import { TalentProfile } from '@/lib/validation';

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type AvailabilityStatus = 'Available' | 'Busy' | 'Away';

const profiles = [
  {
    name: "Sarah Chen",
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    hourlyRate: 150,
    contact: {
      email: "sarah.chen@company.com",
      phone: "(555) 123-4567",
      website: "https://sarahchen.dev",
      social: {
        linkedin: "linkedin.com/in/sarahchen",
        github: "github.com/sarahchen"
      }
    },
    skills: [
      { name: "JavaScript", proficiency: "Expert", category: "Software Development" },
      { name: "React", proficiency: "Expert", category: "Software Development" },
      { name: "Node.js", proficiency: "Expert", category: "Software Development" },
      { name: "TypeScript", proficiency: "Advanced", category: "Software Development" },
      { name: "AWS", proficiency: "Advanced", category: "Software Development" },
      { name: "Microservices", proficiency: "Advanced", category: "Software Development" },
      { name: "CI/CD", proficiency: "Advanced", category: "Software Development" },
      { name: "Test Automation", proficiency: "Advanced", category: "Software Development" }
    ],
    availability: {
      status: "Available",
      availableFrom: "March 1, 2024"
    },
    education: [
      {
        institution: "Stanford University",
        degree: "MS Computer Science",
        field: "Computer Science",
        startDate: "2020-01-01",
        endDate: "2022-01-01"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "Marcus Rodriguez",
    title: "Lead Data Scientist",
    department: "Data Science",
    hourlyRate: 180,
    contact: {
      email: "marcus.rodriguez@company.com",
      phone: "(555) 234-5678",
      website: "https://marcusrodriguez.dev",
      social: {
        linkedin: "linkedin.com/in/marcusrodriguez",
        github: "github.com/marcusrodriguez"
      }
    },
    skills: [
      { name: "Python", proficiency: "Expert", category: "Software Development" },
      { name: "Machine Learning", proficiency: "Expert", category: "Data Science" },
      { name: "TensorFlow", proficiency: "Expert", category: "Data Science" },
      { name: "SQL", proficiency: "Advanced", category: "Data Science" },
      { name: "Data Analysis", proficiency: "Advanced", category: "Data Science" },
      { name: "Big Data", proficiency: "Advanced", category: "Data Science" },
      { name: "Data Visualization", proficiency: "Advanced", category: "Data Science" },
      { name: "Statistical Analysis", proficiency: "Advanced", category: "Data Science" }
    ],
    availability: {
      status: "Busy",
      availableFrom: "April 15, 2024"
    },
    education: [
      {
        institution: "MIT",
        degree: "PhD in Machine Learning",
        field: "Machine Learning",
        startDate: "2018-01-01",
        endDate: "2023-01-01"
      }
    ],
    certifications: [
      {
        name: "Certified Data Scientist",
        issuer: "Data Science Council",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "Emma Thompson",
    title: "Senior UI/UX Designer",
    department: "Design",
    hourlyRate: 140,
    contact: {
      email: "emma.thompson@company.com",
      phone: "(555) 345-6789",
      website: "https://emmathompson.design",
      social: {
        linkedin: "linkedin.com/in/emmathompson",
        dribbble: "dribbble.com/emmathompson"
      }
    },
    skills: [
      { name: "UI Design", proficiency: "Expert", category: "Design" },
      { name: "UX Design", proficiency: "Expert", category: "Design" },
      { name: "Figma", proficiency: "Expert", category: "Design" },
      { name: "Prototyping", proficiency: "Advanced", category: "Design" },
      { name: "User Research", proficiency: "Advanced", category: "Design" },
      { name: "Design Systems", proficiency: "Advanced", category: "Design" },
      { name: "Information Architecture", proficiency: "Advanced", category: "Design" },
      { name: "Visual Design", proficiency: "Advanced", category: "Design" }
    ],
    availability: {
      status: "Available",
      availableFrom: "March 15, 2024"
    },
    education: [
      {
        institution: "Rhode Island School of Design",
        degree: "BFA in Design",
        field: "Design",
        startDate: "2016-01-01",
        endDate: "2020-01-01"
      }
    ],
    certifications: [
      {
        name: "Google UX Design Certificate",
        issuer: "Google",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "David Kim",
    title: "Product Designer",
    department: "Design",
    hourlyRate: 120,
    contact: {
      email: "david.kim@company.com",
      phone: "(555) 456-7890",
      website: "https://davidkim.design",
      social: {
        linkedin: "linkedin.com/in/davidkim",
        behance: "behance.net/davidkim"
      }
    },
    skills: [
      { name: "Product Design", proficiency: "Expert", category: "Design" },
      { name: "Interaction Design", proficiency: "Expert", category: "Design" },
      { name: "Adobe XD", proficiency: "Expert", category: "Design" },
      { name: "Sketch", proficiency: "Advanced", category: "Design" },
      { name: "Motion Graphics", proficiency: "Advanced", category: "Design" },
      { name: "Brand Identity Design", proficiency: "Advanced", category: "Design" },
      { name: "Design Systems", proficiency: "Advanced", category: "Design" },
      { name: "User Testing", proficiency: "Advanced", category: "Design" }
    ],
    availability: {
      status: "Available",
      availableFrom: "April 1, 2024"
    },
    education: [
      {
        institution: "Parsons School of Design",
        degree: "MFA in Design",
        field: "Design",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    certifications: [
      {
        name: "Adobe Certified Expert",
        issuer: "Adobe",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "Alexandra Martinez",
    title: "Senior Project Manager",
    department: "Project Management",
    hourlyRate: 160,
    contact: {
      email: "alexandra.martinez@company.com",
      phone: "(555) 567-8901",
      website: "https://alexandramartinez.com",
      social: {
        linkedin: "linkedin.com/in/alexandramartinez"
      }
    },
    skills: [
      { name: "Project Management", proficiency: "Expert", category: "Project Management" },
      { name: "Agile Methodology", proficiency: "Expert", category: "Project Management" },
      { name: "Scrum", proficiency: "Expert", category: "Project Management" },
      { name: "Risk Management", proficiency: "Advanced", category: "Project Management" },
      { name: "Resource Allocation", proficiency: "Advanced", category: "Project Management" },
      { name: "Stakeholder Management", proficiency: "Advanced", category: "Project Management" },
      { name: "Budget Management", proficiency: "Advanced", category: "Project Management" },
      { name: "JIRA", proficiency: "Advanced", category: "Project Management" }
    ],
    availability: {
      status: "Available",
      availableFrom: "March 20, 2024"
    },
    education: [
      {
        institution: "Harvard Business School",
        degree: "MBA",
        field: "Business Administration",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    certifications: [
      {
        name: "PMP",
        issuer: "Project Management Institute",
        date: "2023-01-01"
      },
      {
        name: "Certified ScrumMaster (CSM)",
        issuer: "Scrum Alliance",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "James Wilson",
    title: "Business Strategy Manager",
    department: "Business",
    hourlyRate: 170,
    contact: {
      email: "james.wilson@company.com",
      phone: "(555) 678-9012",
      website: "https://jameswilson.biz",
      social: {
        linkedin: "linkedin.com/in/jameswilson"
      }
    },
    skills: [
      { name: "Business Strategy", proficiency: "Expert", category: "Business & Finance" },
      { name: "Financial Analysis", proficiency: "Expert", category: "Business & Finance" },
      { name: "Market Research", proficiency: "Expert", category: "Business & Finance" },
      { name: "Strategic Planning", proficiency: "Advanced", category: "Business & Finance" },
      { name: "Business Development", proficiency: "Advanced", category: "Business & Finance" },
      { name: "Competitive Analysis", proficiency: "Advanced", category: "Business & Finance" },
      { name: "Process Improvement", proficiency: "Advanced", category: "Business & Finance" },
      { name: "Salesforce", proficiency: "Advanced", category: "Business & Finance" }
    ],
    availability: {
      status: "Available",
      availableFrom: "May 1, 2024"
    },
    education: [
      {
        institution: "Wharton School",
        degree: "MBA",
        field: "Business Administration",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    certifications: [
      {
        name: "Chartered Financial Analyst (CFA)",
        issuer: "CFA Institute",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "Sophia Patel",
    title: "Technical Product Manager",
    department: "Product",
    hourlyRate: 145,
    contact: {
      email: "sophia.patel@company.com",
      phone: "(555) 789-0123",
      website: "https://sophiapatel.com",
      social: {
        linkedin: "linkedin.com/in/sophiapatel"
      }
    },
    skills: [
      { name: "Product Management", proficiency: "Expert", category: "Product Management" },
      { name: "Technical Leadership", proficiency: "Expert", category: "Leadership" },
      { name: "Agile Development", proficiency: "Expert", category: "Project Management" },
      { name: "User Story Writing", proficiency: "Advanced", category: "Product Management" },
      { name: "Product Roadmapping", proficiency: "Advanced", category: "Product Management" },
      { name: "Data Analysis", proficiency: "Advanced", category: "Data Science" },
      { name: "Stakeholder Management", proficiency: "Advanced", category: "Project Management" },
      { name: "A/B Testing", proficiency: "Advanced", category: "Product Management" }
    ],
    availability: {
      status: "Available",
      availableFrom: "April 10, 2024"
    },
    education: [
      {
        institution: "University",
        degree: "MS Computer Science",
        field: "Computer Science",
        startDate: "2016-01-01",
        endDate: "2018-01-01"
      },
      {
        institution: "University",
        degree: "MS Business Administration",
        field: "Business Administration",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    certifications: [
      {
        name: "Certified Scrum Product Owner (CSPO)",
        issuer: "Scrum Alliance",
        date: "2023-01-01"
      }
    ]
  },
  {
    name: "Michael Chang",
    title: "Solutions Architect",
    department: "Engineering",
    hourlyRate: 190,
    contact: {
      email: "michael.chang@company.com",
      phone: "(555) 890-1234",
      website: "https://michaelchang.dev",
      social: {
        linkedin: "linkedin.com/in/michaelchang"
      }
    },
    skills: [
      { name: "Cloud Architecture", proficiency: "Expert", category: "Software Development" },
      { name: "System Design", proficiency: "Expert", category: "Software Development" },
      { name: "AWS", proficiency: "Expert", category: "Software Development" },
      { name: "Kubernetes", proficiency: "Advanced", category: "Software Development" },
      { name: "Microservices", proficiency: "Advanced", category: "Software Development" },
      { name: "DevOps", proficiency: "Advanced", category: "Software Development" },
      { name: "Infrastructure as Code", proficiency: "Advanced", category: "Software Development" },
      { name: "Technical Leadership", proficiency: "Advanced", category: "Leadership" }
    ],
    availability: {
      status: "Available",
      availableFrom: "June 1, 2024"
    },
    education: [
      {
        institution: "Georgia Tech",
        degree: "MS Computer Science",
        field: "Computer Science",
        startDate: "2016-01-01",
        endDate: "2018-01-01"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect Professional",
        issuer: "Amazon Web Services",
        date: "2023-01-01"
      }
    ]
  }
];

function generateProfileId(name: string): string {
  return 'p' + Math.random().toString(36).substr(2, 6);
}

function main() {
  const profilesJsonPath = path.join(process.cwd(), 'data', 'profiles.json');

  // Convert to TalentProfile format and add IDs
  const talentProfiles: TalentProfile[] = profiles.map(profile => ({
    id: generateProfileId(profile.name),
    ...profile,
    skills: profile.skills.map(skill => ({
      ...skill,
      proficiency: skill.proficiency as ProficiencyLevel,
      id: generateProfileId(skill.name)
    })),
    availability: {
      ...profile.availability,
      status: profile.availability.status as AvailabilityStatus
    }
  }));

  // Write to profiles.json
  fs.writeFileSync(
    profilesJsonPath,
    JSON.stringify({ profiles: talentProfiles }, null, 2)
  );

  console.log(`Successfully loaded ${talentProfiles.length} profiles into profiles.json`);
}

main(); 