import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import { TalentProfile } from '@/types';
import { ShareProfileModal } from './ShareProfileModal';

interface ShareButtonProps {
  profile: TalentProfile;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButton({ profile, variant = 'outline', size = 'md' }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2.5 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'default') {
      return 'text-white bg-gradient-primary hover:bg-gradient-primary-hover';
    }
    return 'text-black bg-white border border-gray-300 hover:bg-gray-50';
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 font-medium rounded-md transition-colors ${getSizeClasses()} ${getVariantClasses()}`}
      >
        <ShareIcon className="h-4 w-4" />
        Share
      </button>
      
      <ShareProfileModal
        profile={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 