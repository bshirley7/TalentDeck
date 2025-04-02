import { promises as fs } from 'fs';
import path from 'path';
import { DataStore, TalentProfile, Skill } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists
if (!fs.access(DATA_DIR, fs.constants.F_OK)) {
  fs.mkdir(DATA_DIR, { recursive: true });
}

// Helper function to read JSON file
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return defaultValue;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath: string, data: any): Promise<void> {
  const dataDir = path.dirname(filePath);
  if (!fs.access(dataDir, fs.constants.F_OK)) {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

// Profiles operations
export async function getProfilesData(): Promise<{ profiles: TalentProfile[] }> {
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profiles data:', error);
    return { profiles: [] };
  }
}

export async function saveProfilesData(data: { profiles: TalentProfile[] }): Promise<void> {
  try {
    await fs.writeFile(PROFILES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving profiles data:', error);
    throw error;
  }
}

// Skills operations
export async function getSkillsData(): Promise<DataStore> {
  return readJsonFile(SKILLS_FILE, { profiles: [], skills: [] });
}

export async function saveSkillsData(data: DataStore): Promise<void> {
  await writeJsonFile(SKILLS_FILE, data);
}

// Search operations
export function searchProfiles(profiles: TalentProfile[], query: string): TalentProfile[] {
  const searchTerm = query.toLowerCase();
  return profiles.filter(profile => {
    return (
      profile.name.toLowerCase().includes(searchTerm) ||
      profile.department.toLowerCase().includes(searchTerm) ||
      profile.title.toLowerCase().includes(searchTerm) ||
      profile.skills.some(skill => 
        skill.name.toLowerCase().includes(searchTerm) ||
        skill.category.toLowerCase().includes(searchTerm)
      )
    );
  });
} 