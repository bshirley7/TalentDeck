'use server';

import { store } from './store';
import { TalentProfile, Skill } from '@/types';

// Profile actions
export async function getAllProfiles() {
  return store.getProfiles();
}

export async function getProfile(id: string) {
  return store.getProfile(id);
}

export async function addProfile(profile: Omit<TalentProfile, 'id'>) {
  return store.addProfile(profile);
}

export async function updateProfile(id: string, profile: Partial<TalentProfile>) {
  return store.updateProfile(id, profile);
}

export async function deleteProfile(id: string) {
  return store.deleteProfile(id);
}

// Skills actions
export async function getAllSkills() {
  const skills = store.getSkills();
  if (skills.length === 0) {
    // If no skills exist, load them from SKILLS.md
    const { parseSkillsMarkdown } = await import('./utils/skillsLoader');
    const defaultSkills = parseSkillsMarkdown();
    defaultSkills.forEach(skill => store.addSkill(skill));
    return store.getSkills();
  }
  return skills;
}

export async function addSkill(skill: Omit<Skill, 'id'>) {
  return store.addSkill(skill);
}

export async function deleteSkill(id: string) {
  return store.deleteSkill(id);
}

// Search action
export async function searchProfiles(query: string) {
  return store.searchProfiles(query);
} 