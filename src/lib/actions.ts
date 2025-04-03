'use server';

import { store } from './server/store';
import { TalentProfile, Skill } from '@/types';
import { saveProfilesData } from './server/data';

// Profile actions
export async function getAllProfiles() {
  const dataStore = await store;
  return dataStore.getProfiles();
}

export async function getProfile(id: string) {
  const dataStore = await store;
  return dataStore.getProfile(id);
}

export async function addProfile(profile: Omit<TalentProfile, 'id'>) {
  const dataStore = await store;
  return dataStore.addProfile(profile);
}

export async function updateProfile(id: string, data: Partial<TalentProfile>) {
  'use server';
  
  try {
    const profiles = await getAllProfiles();
    const profileIndex = profiles.findIndex((p: TalentProfile) => p.id === id);

    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    // Update the profile with the new data
    const updatedProfile = {
      ...profiles[profileIndex],
      ...data,
    };

    // Save the updated profiles
    await saveProfilesData({ profiles: [...profiles.slice(0, profileIndex), updatedProfile, ...profiles.slice(profileIndex + 1)] });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function deleteProfile(id: string) {
  const dataStore = await store;
  return dataStore.deleteProfile(id);
}

// Skills actions
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

// Category actions
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

// Search actions
export async function searchProfiles(query: string) {
  const dataStore = await store;
  return dataStore.searchProfiles(query);
} 