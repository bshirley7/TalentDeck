import { TalentProfile } from '@/types';
import { ShareButton } from '../ShareButton';

interface TalentCardProps {
  profile: TalentProfile;
}

export function TalentCard({ profile }: TalentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Project':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Leave':
        return 'bg-gray-100 text-gray-800';
      case 'Limited':
        return 'bg-orange-100 text-orange-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with photo and basic info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(profile.name)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {profile.name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{profile.title}</p>
          <p className="text-sm text-gray-500">{profile.department}</p>
        </div>
        
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability.status)}`}>
            {profile.availability.status}
          </span>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-primary text-white hover:bg-gradient-primary-hover transition-colors"
              >
                {skill.name}
              </span>
            ))}
            {profile.skills.length > 6 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{profile.skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rates */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">Hourly</p>
            <p className="text-sm font-semibold text-gray-900">${profile.hourlyRate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Daily</p>
            <p className="text-sm font-semibold text-gray-900">${profile.dayRate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Annual</p>
            <p className="text-sm font-semibold text-gray-900">${profile.yearlySalary?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Contact & Share Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{profile.contact.email}</span>
        </div>
        
        <ShareButton profile={profile} size="sm" />
      </div>
    </div>
  );
} 