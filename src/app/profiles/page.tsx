import { getAllProfiles } from '@/lib/actions';
import { ProfileTable } from '@/components/profiles/ProfileTable';

export default async function ProfilesPage() {
  const profiles = await getAllProfiles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Talent Profiles</h1>
        <p className="mt-2 text-gray-600">
          Browse and manage talent profiles across the organization.
        </p>
      </div>
      <ProfileTable profiles={profiles} />
    </div>
  );
} 