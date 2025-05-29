'use client';

import { useEffect, useState } from 'react';
import { getAllProfiles } from '@/lib/actions';
import { ProfileTable, ProfileSearch } from '@/components/profiles/display';
import { ExportProfiles } from '@/components/profiles/ExportProfiles';
import Link from 'next/link';
import { TalentProfile } from '@/types';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<TalentProfile[]>([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfiles = async () => {
    try {
      const data = await getAllProfiles();
      setProfiles(data);
      setFilteredProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  useEffect(() => {
    const initializeProfiles = async () => {
      setIsLoading(true);
      await loadProfiles();
      setIsLoading(false);
    };

    initializeProfiles();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    
    try {
      const response = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        // Refresh the profile list from the server instead of updating local state
        await loadProfiles();
        console.log('✅ Profile deleted and list refreshed');
      } else {
        console.error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Talent Profiles</h1>
          <p className="mt-2 text-gray-600">
            Browse and manage talent profiles across the organization.
          </p>
        </div>
        <Link
          href="/profiles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-primary hover:bg-gradient-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Create New Profile
        </Link>
      </div>

      <ProfileSearch profiles={profiles} onSearch={setFilteredProfiles} />
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredProfiles.length} of {profiles.length} profiles
          {selectedProfileIds.length > 0 && (
            <span className="ml-2 font-medium text-blue-600">
              • {selectedProfileIds.length} selected
            </span>
          )}
        </div>
        {selectedProfileIds.length > 0 && (
          <ExportProfiles 
            profiles={profiles.filter(p => selectedProfileIds.includes(p.id))} 
          />
        )}
      </div>

      <ProfileTable 
        profiles={filteredProfiles} 
        onDelete={handleDelete}
        selectedProfiles={selectedProfileIds}
        onProfileSelectionChange={setSelectedProfileIds}
      />
    </div>
  );
} 