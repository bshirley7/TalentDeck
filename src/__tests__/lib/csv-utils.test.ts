import { escapeCSVField, profilesToCSV, parseCSVLine, csvToProfiles } from '@/lib/utils';
import { TalentProfile } from '@/types';

describe('CSV Utilities', () => {
  describe('escapeCSVField', () => {
    it('should return empty string for null/undefined', () => {
      expect(escapeCSVField(null)).toBe('');
      expect(escapeCSVField(undefined)).toBe('');
    });

    it('should escape fields with commas', () => {
      expect(escapeCSVField('hello, world')).toBe('"hello, world"');
    });

    it('should escape fields with quotes', () => {
      expect(escapeCSVField('say "hello"')).toBe('"say ""hello"""');
    });

    it('should handle simple strings', () => {
      expect(escapeCSVField('simple text')).toBe('simple text');
    });
  });

  describe('parseCSVLine', () => {
    it('should parse simple CSV line', () => {
      expect(parseCSVLine('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should parse CSV line with quoted fields', () => {
      expect(parseCSVLine('a,"b,c",d')).toEqual(['a', 'b,c', 'd']);
    });

    it('should parse CSV line with escaped quotes', () => {
      expect(parseCSVLine('a,"say ""hello""",b')).toEqual(['a', 'say "hello"', 'b']);
    });
  });

  describe('CSV Export/Import', () => {
    const mockProfile: TalentProfile = {
      id: '1',
      name: 'John Doe',
      department: 'Engineering',
      title: 'Senior Developer',
      hourlyRate: 100,
      dayRate: 800,
      yearlySalary: 120000,
      contact: {
        email: 'john@example.com',
        phone: '+1234567890',
        website: 'https://johndoe.dev',
        social: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        }
      },
      skills: [
        {
          id: 'skill1',
          name: 'JavaScript',
          category: 'Programming',
          proficiency: 'Expert'
        },
        {
          id: 'skill2',
          name: 'React',
          category: 'Frontend',
          proficiency: 'Advanced'
        }
      ],
      availability: {
        status: 'Available',
        timezone: 'UTC-5',
        capacity: {
          weeklyHours: 40,
          maxConcurrentProjects: 2,
          preferredProjectDuration: {
            min: 30,
            max: 180
          }
        }
      },
      bio: 'Experienced developer',
      tags: ['remote', 'senior'],
      education: [
        {
          institution: 'MIT',
          degree: 'Bachelor',
          field: 'Computer Science',
          startDate: '2015',
          endDate: '2019'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified',
          issuer: 'Amazon',
          date: '2023-01-15',
          expiryDate: '2025-01-15'
        }
      ]
    };

    it('should export profiles to CSV', () => {
      const csv = profilesToCSV([mockProfile]);
      expect(csv).toContain('id,name,department,title');
      expect(csv).toContain('1,John Doe,Engineering,Senior Developer');
      expect(csv).toContain('JavaScript:Programming:Expert|React:Frontend:Advanced');
      expect(csv).toContain('remote|senior');
    });

    it('should handle empty profiles array', () => {
      const csv = profilesToCSV([]);
      expect(csv).toBe('');
    });

    it('should round-trip CSV export/import', () => {
      const csv = profilesToCSV([mockProfile]);
      const parsed = csvToProfiles(csv);
      
      expect(parsed).toHaveLength(1);
      const profile = parsed[0];
      
      expect(profile.name).toBe('John Doe');
      expect(profile.department).toBe('Engineering');
      expect(profile.title).toBe('Senior Developer');
      expect(profile.skills).toHaveLength(2);
      expect(profile.tags).toEqual(['remote', 'senior']);
    });
  });
}); 