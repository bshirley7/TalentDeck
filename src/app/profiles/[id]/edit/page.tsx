'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { TalentProfile } from '@/types';
import { getProfile, updateProfile } from '@/lib/actions';
import { ProfileEditForm } from '@/components/profiles/ProfileEditForm';
import { toast } from 'sonner';

export default function ProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [resolvedParams.id]);

  const handleSubmit = async (updatedProfile: TalentProfile) => {
    try {
      setIsSubmitting(true);
      console.log('🚀 Submitting profile update for:', resolvedParams.id);
      console.log('📝 Update data:', updatedProfile);
      
      await updateProfile(resolvedParams.id, updatedProfile);
      
      console.log('✅ Profile updated successfully');
      toast.success('Profile updated successfully');
      router.push(`/profiles/${resolvedParams.id}`);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you&apos;re looking for doesn&apos;t exist or may have been deleted.</p>
          <button
            onClick={() => router.push('/profiles')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update {profile.name}&apos;s information</p>
      </div>

      <ProfileEditForm 
        initialData={profile}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 