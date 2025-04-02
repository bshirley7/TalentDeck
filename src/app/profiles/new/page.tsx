'use client';

import { ProfileCreationForm } from '@/components/profiles/ProfileCreationForm';

export default function NewProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Profile</h1>
        <p className="mt-2 text-gray-600">
          Add a new talent profile to the organization's talent pool.
        </p>
      </div>
      <ProfileCreationForm />
    </div>
  );
} 