'use client';

import { useEffect, useState } from 'react';
import { getAllProfiles } from '@/lib/actions';
import { ProfileTable } from '@/components/profiles/ProfileTable';
import { ProfileSearch } from '@/components/profiles/ProfileSearch';
import Link from 'next/link';
import { TalentProfile } from '@/types';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await getAllProfiles();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Profile
        </Link>
      </div>

      <ProfileSearch profiles={profiles} onSearch={setFilteredProfiles} />
      
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredProfiles.length} of {profiles.length} profiles
      </div>

      <ProfileTable profiles={filteredProfiles} />
    </div>
  );
} 