import fs from 'fs';
import path from 'path';
import { TalentProfile, Skill } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE_PATH = path.join(DATA_DIR, 'profiles.json');
const SKILLS_FILE_PATH = path.join(DATA_DIR, 'skills.json');

export class DataStore {
  private static instance: DataStore;
  private profiles: TalentProfile[] = [];
  private skills: Skill[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private loadData() {
    try {
      if (fs.existsSync(PROFILES_FILE_PATH)) {
        const profilesData = JSON.parse(fs.readFileSync(PROFILES_FILE_PATH, 'utf-8'));
        this.profiles = profilesData.profiles || [];
      }
      if (fs.existsSync(SKILLS_FILE_PATH)) {
        const skillsData = JSON.parse(fs.readFileSync(SKILLS_FILE_PATH, 'utf-8'));
        this.skills = skillsData.skills || [];
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private saveData() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(PROFILES_FILE_PATH, JSON.stringify({ profiles: this.profiles }, null, 2));
      fs.writeFileSync(SKILLS_FILE_PATH, JSON.stringify({ skills: this.skills }, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Profile methods
  public getProfiles(): TalentProfile[] {
    return this.profiles;
  }

  public clearProfiles(): void {
    this.profiles = [];
    this.saveData();
  }

  public getProfile(id: string): TalentProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public addProfile(profile: Omit<TalentProfile, 'id'>): TalentProfile {
    const newProfile: TalentProfile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.profiles.push(newProfile);
    this.saveData();
    return newProfile;
  }

  public updateProfile(id: string, profile: Partial<TalentProfile>): TalentProfile | undefined {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.profiles[index] = { ...this.profiles[index], ...profile };
    this.saveData();
    return this.profiles[index];
  }

  public deleteProfile(id: string): boolean {
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.profiles.length !== initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Skills methods
  public getSkills(): Skill[] {
    return this.skills;
  }

  public clearSkills(): void {
    this.skills = [];
    this.saveData();
  }

  public addSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = {
      ...skill,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.skills.push(newSkill);
    this.saveData();
    return newSkill;
  }

  public deleteSkill(id: string): boolean {
    const initialLength = this.skills.length;
    this.skills = this.skills.filter(s => s.id !== id);
    if (this.skills.length !== initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Search method
  public searchProfiles(query: string): TalentProfile[] {
    const searchTerm = query.toLowerCase();
    return this.profiles.filter(profile => {
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

  // Category methods
  public getCategories(): string[] {
    return Array.from(new Set(this.skills.map(skill => skill.category)));
  }

  public addCategory(category: string): string {
    // Categories are derived from skills, so we don't need to store them separately
    return category;
  }

  public deleteCategory(category: string): boolean {
    // Check if category has any associated skills
    if (this.skills.some(skill => skill.category === category)) {
      return false;
    }
    return true;
  }
}

export const store = DataStore.getInstance(); 