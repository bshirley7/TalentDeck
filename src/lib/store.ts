import fs from 'fs/promises';
import path from 'path';
import { TalentProfile, Skill } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE_PATH = path.join(DATA_DIR, 'profiles.json');
const SKILLS_FILE_PATH = path.join(DATA_DIR, 'skills.json');
const CATEGORIES_FILE_PATH = path.join(DATA_DIR, 'categories.json');

export class DataStore {
  private static instance: DataStore;
  private static instancePromise: Promise<DataStore> | null = null;
  private profiles: TalentProfile[] = [];
  private skills: Skill[] = [];
  private categories: string[] = [];
  private initialized: boolean = false;

  private constructor() {}

  public static async getInstance(): Promise<DataStore> {
    if (!DataStore.instancePromise) {
      DataStore.instancePromise = (async () => {
        if (!DataStore.instance) {
          DataStore.instance = new DataStore();
          await DataStore.instance.initialize();
        }
        return DataStore.instance;
      })();
    }
    return DataStore.instancePromise;
  }

  private async initialize() {
    if (this.initialized) return;
    
    try {
      await this.loadData();
      await this.ensureUncategorizedCategory();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing data store:', error);
      throw error;
    }
  }

  private async loadData() {
    try {
      // Ensure data directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Load profiles
      try {
        const profilesData = JSON.parse(await fs.readFile(PROFILES_FILE_PATH, 'utf-8'));
        this.profiles = profilesData.profiles || [];
      } catch (error) {
        console.error('Error loading profiles:', error);
        this.profiles = [];
      }

      // Load skills
      try {
        const skillsData = JSON.parse(await fs.readFile(SKILLS_FILE_PATH, 'utf-8'));
        this.skills = skillsData.skills || [];
      } catch (error) {
        console.error('Error loading skills:', error);
        this.skills = [];
      }

      // Load categories
      try {
        const categoriesData = JSON.parse(await fs.readFile(CATEGORIES_FILE_PATH, 'utf-8'));
        this.categories = categoriesData.categories || [];
      } catch (error) {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  private async saveData() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await Promise.all([
        fs.writeFile(PROFILES_FILE_PATH, JSON.stringify({ profiles: this.profiles }, null, 2)),
        fs.writeFile(SKILLS_FILE_PATH, JSON.stringify({ skills: this.skills }, null, 2)),
        fs.writeFile(CATEGORIES_FILE_PATH, JSON.stringify({ categories: this.categories }, null, 2))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  private async ensureUncategorizedCategory() {
    if (!this.categories.includes('Uncategorized')) {
      this.categories.push('Uncategorized');
      await this.saveData();
    }
  }

  // Profile methods
  public async getProfiles(): Promise<TalentProfile[]> {
    if (!this.initialized) await this.initialize();
    return this.profiles;
  }

  public async clearProfiles(): Promise<void> {
    this.profiles = [];
    await this.saveData();
  }

  public async getProfile(id: string): Promise<TalentProfile | undefined> {
    if (!this.initialized) await this.initialize();
    return this.profiles.find(p => String(p.id) === String(id));
  }

  public async addProfile(profile: Omit<TalentProfile, 'id'>): Promise<TalentProfile> {
    if (!this.initialized) await this.initialize();
    const newProfile: TalentProfile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.profiles.push(newProfile);
    await this.saveData();
    return newProfile;
  }

  public async updateProfile(id: string, profile: Partial<TalentProfile>): Promise<TalentProfile | undefined> {
    if (!this.initialized) await this.initialize();
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.profiles[index] = { ...this.profiles[index], ...profile };
    await this.saveData();
    return this.profiles[index];
  }

  public async deleteProfile(id: string): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.profiles.length !== initialLength) {
      await this.saveData();
      return true;
    }
    return false;
  }

  // Skills methods
  public async getSkills(): Promise<Skill[]> {
    if (!this.initialized) await this.initialize();
    return this.skills;
  }

  public async clearSkills(): Promise<void> {
    this.skills = [];
    await this.saveData();
  }

  public async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    if (!this.initialized) await this.initialize();
    const newSkill: Skill = {
      ...skill,
      id: Math.random().toString(36).substr(2, 9),
      category: skill.category || 'Uncategorized'
    };
    this.skills.push(newSkill);
    await this.saveData();
    return newSkill;
  }

  public async deleteSkill(id: string): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    try {
      // Find the skill to delete
      const skillToDelete = this.skills.find(s => s.id === id);
      if (!skillToDelete) {
        return false;
      }

      // Remove the skill
      this.skills = this.skills.filter(s => s.id !== id);

      // Remove any "Category:" skills that might have been created
      this.skills = this.skills.filter(s => !s.name.startsWith('Category:'));

      // Save the changes
      await this.saveData();

      // Return success
      return true;
    } catch (error) {
      console.error('Error deleting skill:', error);
      return false;
    }
  }

  // Search method
  public async searchProfiles(query: string): Promise<TalentProfile[]> {
    if (!this.initialized) await this.initialize();
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
  public async getCategories(): Promise<string[]> {
    if (!this.initialized) await this.initialize();
    // Return all categories except "Uncategorized" which is handled internally
    return this.categories.filter(category => category !== 'Uncategorized');
  }

  public async addCategory(category: string): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    try {
      // Validate category name
      if (!category || typeof category !== 'string' || category.trim() === '') {
        return false;
      }

      // Don't allow adding "Uncategorized" as it's reserved
      if (category === 'Uncategorized') {
        return false;
      }

      // Check if category already exists
      if (this.categories.includes(category)) {
        return false;
      }

      // Add the category
      this.categories.push(category);
      await this.saveData();
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  }

  public async deleteCategory(category: string): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    try {
      // Don't allow deleting the Uncategorized category
      if (category === 'Uncategorized') {
        return false;
      }

      // Check if category exists
      if (!this.categories.includes(category)) {
        return false;
      }

      // Move all skills in this category to "Uncategorized"
      this.skills = this.skills.map(skill => ({
        ...skill,
        category: skill.category === category ? 'Uncategorized' : skill.category
      }));

      // Remove the category from the categories list
      this.categories = this.categories.filter(c => c !== category);
      
      // Save the updated data
      await this.saveData();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  public async updateCategory(oldName: string, newName: string): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    try {
      // Don't allow updating the Uncategorized category
      if (oldName === 'Uncategorized') {
        return false;
      }

      // Validate new name
      if (!newName || typeof newName !== 'string' || newName.trim() === '') {
        return false;
      }

      // Check if old category exists
      if (!this.categories.includes(oldName)) {
        return false;
      }

      // Check if new name already exists (unless it's the same category)
      if (this.categories.includes(newName) && oldName !== newName) {
        return false;
      }

      // Update the category name in the categories list
      this.categories = this.categories.map(c => 
        c === oldName ? newName : c
      );

      // Update all skills with this category
      this.skills = this.skills.map(skill => ({
        ...skill,
        category: skill.category === oldName ? newName : skill.category
      }));

      // Save the updated data
      await this.saveData();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const store = DataStore.getInstance(); 