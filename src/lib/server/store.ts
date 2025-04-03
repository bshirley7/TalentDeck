import { DataStore, TalentProfile, Skill, SkillsDirectory } from '@/types';
import { getProfilesData, saveProfilesData, getSkillsData, saveSkillsData, searchProfiles as searchProfilesUtil } from './data';

class DataStoreImpl implements DataStore {
  private static instance: DataStoreImpl;
  public profiles: TalentProfile[] = [];
  public skills: SkillsDirectory[] = [];

  private constructor() {}

  public static async getInstance(): Promise<DataStoreImpl> {
    if (!DataStoreImpl.instance) {
      DataStoreImpl.instance = new DataStoreImpl();
      await DataStoreImpl.instance.initialize();
    }
    return DataStoreImpl.instance;
  }

  private async initialize() {
    const [profilesData, skillsData] = await Promise.all([
      getProfilesData(),
      getSkillsData()
    ]);
    this.profiles = profilesData.profiles;
    this.skills = skillsData.skills;
  }

  // Profile methods
  async getProfiles(): Promise<TalentProfile[]> {
    return this.profiles;
  }

  async getProfile(id: string): Promise<TalentProfile | undefined> {
    return this.profiles.find(p => p.id === id);
  }

  async addProfile(profile: Omit<TalentProfile, 'id'>): Promise<TalentProfile> {
    const newProfile: TalentProfile = {
      ...profile,
      id: crypto.randomUUID()
    };
    this.profiles.push(newProfile);
    await saveProfilesData({ profiles: this.profiles });
    return newProfile;
  }

  async updateProfile(id: string, data: Partial<TalentProfile>): Promise<TalentProfile> {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Profile not found');
    }
    this.profiles[index] = { ...this.profiles[index], ...data };
    await saveProfilesData({ profiles: this.profiles });
    return this.profiles[index];
  }

  async deleteProfile(id: string): Promise<void> {
    this.profiles = this.profiles.filter(p => p.id !== id);
    await saveProfilesData({ profiles: this.profiles });
  }

  // Skills methods
  async getSkills(): Promise<SkillsDirectory[]> {
    return this.skills;
  }

  async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID()
    };
    const directorySkill: SkillsDirectory = {
      ...newSkill,
      count: 0
    };
    this.skills.push(directorySkill);
    await saveSkillsData({ profiles: [], skills: this.skills });
    return newSkill;
  }

  async deleteSkill(id: string): Promise<void> {
    this.skills = this.skills.filter(s => s.id !== id);
    await saveSkillsData({ profiles: [], skills: this.skills });
  }

  // Category methods
  async getCategories(): Promise<string[]> {
    return [...new Set(this.skills.map(s => s.category))];
  }

  async addCategory(category: string): Promise<void> {
    // Categories are derived from skills, so no need to store separately
  }

  async deleteCategory(category: string): Promise<void> {
    // Move skills to "Uncategorized" category
    this.skills = this.skills.map(skill => 
      skill.category === category ? { ...skill, category: 'Uncategorized' } : skill
    );
    await saveSkillsData({ profiles: [], skills: this.skills });
  }

  async updateCategory(oldName: string, newName: string): Promise<void> {
    this.skills = this.skills.map(skill =>
      skill.category === oldName ? { ...skill, category: newName } : skill
    );
    await saveSkillsData({ profiles: [], skills: this.skills });
  }

  // Search methods
  async searchProfiles(query: string): Promise<TalentProfile[]> {
    return searchProfilesUtil(this.profiles, query);
  }
}

export const store = DataStoreImpl.getInstance(); 