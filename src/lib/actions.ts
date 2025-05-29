'use server';

import { TalentProfile, Skill } from '@/types';
import { ProfileService } from '@/services/profiles.service';
import { initializeDatabase } from './db';

// Profile actions - now use ProfileService directly
export async function getAllProfiles(): Promise<TalentProfile[]> {
  try {
    // Initialize database
    await initializeDatabase();
    
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    return await profileService.getAllProfiles();
  } catch (error) {
    console.error('Error fetching profiles from database:', error);
    throw error;
  }
}

export async function getProfile(id: string): Promise<TalentProfile | null> {
  try {
    // Initialize database
    await initializeDatabase();
    
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    return await profileService.getProfileById(id);
  } catch (error) {
    console.error('Error fetching profile from database:', error);
    throw error;
  }
}

export async function createProfile(profileData: Omit<TalentProfile, 'id'>): Promise<TalentProfile> {
  try {
    // Initialize database
    await initializeDatabase();
    
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    return await profileService.createProfile(profileData);
  } catch (error) {
    console.error('Error creating profile in database:', error);
    throw error;
  }
}

export async function updateProfile(id: string, profileData: Partial<TalentProfile>): Promise<TalentProfile> {
  try {
    // Initialize database
    await initializeDatabase();
    
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    return await profileService.updateProfile(id, profileData);
  } catch (error) {
    console.error('Error updating profile in database:', error);
    throw error;
  }
}

export async function deleteProfile(id: string): Promise<boolean> {
  try {
    // Initialize database
    await initializeDatabase();
    
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    return await profileService.deleteProfile(id);
  } catch (error) {
    console.error('Error deleting profile from database:', error);
    throw error;
  }
}

// Search actions - use database through API
export async function searchProfiles(query: string): Promise<TalentProfile[]> {
  try {
    // Get all profiles from database and filter client-side for now
    // In the future, this could be a dedicated search API endpoint
    const profiles = await getAllProfiles();
    
    if (!query.trim()) {
      return profiles;
    }
    
    const searchTerm = query.toLowerCase();
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(searchTerm) ||
      profile.title.toLowerCase().includes(searchTerm) ||
      profile.department.toLowerCase().includes(searchTerm) ||
      profile.bio?.toLowerCase().includes(searchTerm) ||
      profile.skills?.some(skill => skill.name.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error searching profiles in database:', error);
    throw error;
  }
}

// Legacy store-based actions for skills and categories (can be updated later if needed)
import { store } from './server/store';

export async function getAllSkills() {
  const dataStore = await store;
  return dataStore.getSkills();
}

export async function addSkill(skill: Omit<Skill, 'id'>) {
  const dataStore = await store;
  return dataStore.addSkill(skill);
}

export async function deleteSkill(id: string) {
  const dataStore = await store;
  return dataStore.deleteSkill(id);
}

export async function getAllCategories() {
  const dataStore = await store;
  return dataStore.getCategories();
}

export async function addCategory(category: string) {
  const dataStore = await store;
  return dataStore.addCategory(category);
}

export async function deleteCategory(category: string) {
  const dataStore = await store;
  return dataStore.deleteCategory(category);
}

export async function updateCategory(oldName: string, newName: string) {
  const dataStore = await store;
  return dataStore.updateCategory(oldName, newName);
} 