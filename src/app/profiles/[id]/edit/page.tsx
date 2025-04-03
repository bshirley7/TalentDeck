'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { TalentProfile } from '@/types';
import { getProfile, updateProfile } from '@/lib/actions';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileSkillsSection } from '@/components/profile/ProfileSkillsSection';

export default function ProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(resolvedParams.id);
        if (data) {
          setProfile(data);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [resolvedParams.id]);

  const handleSubmit = async (data: TalentProfile) => {
    try {
      await updateProfile(resolvedParams.id, data);
      router.push(`/profiles/${resolvedParams.id}`);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <ProfileForm
        initialData={profile}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 