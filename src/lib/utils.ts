import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TalentProfile } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSV Export utilities
export function escapeCSVField(field: unknown): string {
  if (field === null || field === undefined) return '';
  
  const str = String(field);
  // If the field contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function flattenProfileForCSV(profile: TalentProfile) {
  return {
    // Basic Info
    id: profile.id,
    name: profile.name,
    department: profile.department,
    title: profile.title,
    bio: profile.bio || '',
    about: profile.about || '',
    location: profile.location || '',
    yearsOfExperience: profile.yearsOfExperience || '',
    
    // Contact Info
    email: profile.contact.email,
    phone: profile.contact.phone,
    website: profile.contact.website || '',
    contactLocation: profile.contact.location || '',
    
    // Social Profiles
    linkedin: profile.contact.social?.linkedin || '',
    twitter: profile.contact.social?.twitter || '',
    facebook: profile.contact.social?.facebook || '',
    instagram: profile.contact.social?.instagram || '',
    github: profile.contact.social?.github || '',
    youtube: profile.contact.social?.youtube || '',
    
    // Rates
    hourlyRate: profile.hourlyRate,
    dayRate: profile.dayRate,
    yearlySalary: profile.yearlySalary,
    weeklyProjectRate: profile.projectRates?.weekly || '',
    monthlyProjectRate: profile.projectRates?.monthly || '',
    quarterlyProjectRate: profile.projectRates?.quarterly || '',
    yearlyProjectRate: profile.projectRates?.yearly || '',
    minimumProjectDuration: profile.projectRates?.minimumDuration || '',
    maximumProjectDuration: profile.projectRates?.maximumDuration || '',
    projectDiscountPercentage: profile.projectRates?.discountPercentage || '',
    
    // Availability
    availabilityStatus: profile.availability.status,
    availableFrom: profile.availability.availableFrom || '',
    nextAvailable: profile.availability.nextAvailable || '',
    preferredHours: profile.availability.preferredHours || '',
    timezone: profile.availability.timezone || '',
    bookingLeadTime: profile.availability.bookingLeadTime || '',
    weeklyHours: profile.availability.capacity?.weeklyHours || '',
    maxConcurrentProjects: profile.availability.capacity?.maxConcurrentProjects || '',
    preferredProjectDurationMin: profile.availability.capacity?.preferredProjectDuration?.min || '',
    preferredProjectDurationMax: profile.availability.capacity?.preferredProjectDuration?.max || '',
    
    // Skills (as pipe-separated values)
    skills: profile.skills.map(skill => `${skill.name}:${skill.category}:${skill.proficiency}`).join('|'),
    
    // Tags
    tags: profile.tags?.join('|') || '',
    
    // Education (as pipe-separated entries)
    education: profile.education?.map(edu => 
      `${edu.institution}:${edu.degree}:${edu.field}:${edu.startDate}:${edu.endDate}`
    ).join('|') || '',
    
    // Certifications (as pipe-separated entries)
    certifications: profile.certifications?.map(cert => 
      `${cert.name}:${cert.issuer}:${cert.date}:${cert.expiryDate || ''}`
    ).join('|') || '',
  };
}

export function profilesToCSV(profiles: TalentProfile[]): string {
  if (profiles.length === 0) return '';
  
  const flatProfiles = profiles.map(flattenProfileForCSV);
  const headers = Object.keys(flatProfiles[0]);
  
  // Create CSV header row
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // Create CSV data rows
  const dataRows = flatProfiles.map(profile => 
    headers.map(header => escapeCSVField(profile[header as keyof typeof profile])).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// CSV Import utilities
export function parseCSVField(field: string): string {
  if (!field) return '';
  
  // Remove surrounding quotes and unescape internal quotes
  if (field.startsWith('"') && field.endsWith('"')) {
    return field.slice(1, -1).replace(/""/g, '"');
  }
  return field;
}

export function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote inside quoted field
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(currentField);
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }
  
  // Add the last field
  fields.push(currentField);
  return fields;
}

export function csvToProfiles(csvContent: string): Partial<TalentProfile>[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return []; // Need at least header and one data row
  
  const headers = parseCSVLine(lines[0]);
  const profiles: Partial<TalentProfile>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = {} as any; // Using any for complex nested object building
    
    headers.forEach((header, index) => {
      const value = fields[index] || '';
      
      // Map CSV fields back to profile structure
      switch (header) {
        case 'skills':
          if (value) {
            profile.skills = value.split('|').map(skillStr => {
              const [name, category, proficiency] = skillStr.split(':');
              return { name: name || '', category: category || '', proficiency: proficiency || 'Intermediate' };
            });
          } else {
            profile.skills = [];
          }
          break;
          
        case 'tags':
          profile.tags = value ? value.split('|') : [];
          break;
          
        case 'education':
          if (value) {
            profile.education = value.split('|').map(eduStr => {
              const [institution, degree, field, startDate, endDate] = eduStr.split(':');
              return { institution: institution || '', degree: degree || '', field: field || '', startDate: startDate || '', endDate: endDate || '' };
            });
          } else {
            profile.education = [];
          }
          break;
          
        case 'certifications':
          if (value) {
            profile.certifications = value.split('|').map(certStr => {
              const [name, issuer, date, expiryDate] = certStr.split(':');
              return { name: name || '', issuer: issuer || '', date: date || '', expiryDate: expiryDate || undefined };
            });
          } else {
            profile.certifications = [];
          }
          break;
          
        // Handle nested contact info
        case 'email':
        case 'phone':
        case 'website':
        case 'contactLocation':
          if (!profile.contact) profile.contact = {};
          const contactKey = header === 'contactLocation' ? 'location' : header;
          profile.contact[contactKey] = value;
          break;
          
        // Handle social profiles
        case 'linkedin':
        case 'twitter':
        case 'facebook':
        case 'instagram':
        case 'github':
        case 'youtube':
          if (!profile.contact) profile.contact = {};
          if (!profile.contact.social) profile.contact.social = {};
          profile.contact.social[header] = value || undefined;
          break;
          
        // Handle project rates
        case 'weeklyProjectRate':
        case 'monthlyProjectRate':
        case 'quarterlyProjectRate':
        case 'yearlyProjectRate':
        case 'minimumProjectDuration':
        case 'maximumProjectDuration':
        case 'projectDiscountPercentage':
          if (!profile.projectRates) profile.projectRates = {};
          const rateKey = header.replace('Project', '').replace('Rate', '').toLowerCase();
          const finalKey = rateKey === 'minimum' ? 'minimumDuration' : 
                          rateKey === 'maximum' ? 'maximumDuration' :
                          rateKey === 'discount' ? 'discountPercentage' : rateKey;
          profile.projectRates[finalKey] = value ? (isNaN(Number(value)) ? value : Number(value)) : undefined;
          break;
          
        // Handle availability
        case 'availabilityStatus':
        case 'availableFrom':
        case 'nextAvailable':
        case 'preferredHours':
        case 'timezone':
        case 'bookingLeadTime':
          if (!profile.availability) profile.availability = {};
          const availKey = header.replace('availability', '').replace('Status', 'status');
          profile.availability[availKey] = value;
          break;
          
        // Handle capacity
        case 'weeklyHours':
        case 'maxConcurrentProjects':
        case 'preferredProjectDurationMin':
        case 'preferredProjectDurationMax':
          if (!profile.availability) profile.availability = {};
          if (!profile.availability.capacity) profile.availability.capacity = {};
          
          if (header.includes('preferredProjectDuration')) {
            if (!profile.availability.capacity.preferredProjectDuration) {
              profile.availability.capacity.preferredProjectDuration = {};
            }
            const key = header.includes('Min') ? 'min' : 'max';
            profile.availability.capacity.preferredProjectDuration[key] = value ? Number(value) : undefined;
          } else {
            const capacityKey = header === 'weeklyHours' ? 'weeklyHours' : 'maxConcurrentProjects';
            profile.availability.capacity[capacityKey] = value ? Number(value) : undefined;
          }
          break;
          
        // Handle numeric fields
        case 'hourlyRate':
        case 'dayRate':
        case 'yearlySalary':
        case 'yearsOfExperience':
          profile[header] = value ? Number(value) : undefined;
          break;
          
        // Handle simple string fields
        default:
          profile[header] = value;
          break;
      }
    });
    
    profiles.push(profile);
  }
  
  return profiles;
}
