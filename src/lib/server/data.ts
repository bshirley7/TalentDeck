import fs from 'fs';
import path from 'path';
import { DataStore, TalentProfile, Skill } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE_PATH = path.join(DATA_DIR, 'profiles.json');
const SKILLS_FILE_PATH = path.join(DATA_DIR, 'skills.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to read JSON file
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return defaultValue;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath: string, data: any): Promise<void> {
  const dataDir = path.dirname(filePath);
  if (!fs.existsSync(dataDir)) {
    await fs.promises.mkdir(dataDir, { recursive: true });
  }

  await fs.promises.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

// Profiles operations
export async function getProfilesData(): Promise<DataStore> {
  return readJsonFile(PROFILES_FILE_PATH, { profiles: [], skills: [] });
}

export async function saveProfilesData(data: DataStore): Promise<void> {
  await writeJsonFile(PROFILES_FILE_PATH, data);
}

// Skills operations
export async function getSkillsData(): Promise<DataStore> {
  return readJsonFile(SKILLS_FILE_PATH, { profiles: [], skills: [] });
}

export async function saveSkillsData(data: DataStore): Promise<void> {
  await writeJsonFile(SKILLS_FILE_PATH, data);
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