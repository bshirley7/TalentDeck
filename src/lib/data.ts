import { DataStore, TalentProfile, SkillsDirectory } from '@/types';
import { TalentProfileFormData } from './validation';

// API endpoints
const API_BASE = typeof window !== 'undefined' 
  ? `${window.location.origin}/api`
  : '/api';

// Profile operations
export async function getAllProfiles(): Promise<TalentProfile[]> {
  const response = await fetch(`${API_BASE}/profiles`);
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return response.json();
}

export async function getProfile(id: string): Promise<TalentProfile> {
  const response = await fetch(`${API_BASE}/profiles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
}

export async function addProfile(profile: TalentProfileFormData): Promise<TalentProfile> {
  const response = await fetch('/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error('Failed to create profile');
  }

  return response.json();
}

export async function updateProfile(id: string, profile: Partial<TalentProfile>): Promise<TalentProfile> {
  const response = await fetch(`${API_BASE}/profiles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
}

export async function deleteProfile(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/profiles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete profile');
  }
}

// Skills operations
export async function getAllSkills(): Promise<SkillsDirectory> {
  const response = await fetch(`${API_BASE}/skills`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
}

export async function addSkill(skill: { name: string; category: string }): Promise<{ id: string; name: string; category: string }> {
  const response = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
  if (!response.ok) {
    throw new Error('Failed to add skill');
  }
  return response.json();
}

export async function deleteSkill(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/skills?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete skill');
  }
}

// Search operations
export async function searchProfiles(query: string): Promise<TalentProfile[]> {
  const response = await fetch(`${API_BASE}/profiles/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search profiles');
  }
  return response.json();
}

// Import operations
export async function importProfiles(file: File): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to import profiles');
  }
  return response.json();
} 