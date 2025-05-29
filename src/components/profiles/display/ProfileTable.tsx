'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TalentProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

interface ProfileTableProps {
  profiles: TalentProfile[];
  onDelete?: (id: string) => void;
  selectedProfiles?: string[];
  onProfileSelectionChange?: (selectedIds: string[]) => void;
}

interface ProfileActionsDropdownProps {
  profile: TalentProfile;
  onDelete?: (id: string) => void;
}

function ProfileActionsDropdown({ profile, onDelete }: ProfileActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleView = () => {
    setIsOpen(false);
    router.push(`/profiles/${profile.id}`);
  };

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/profiles/${profile.id}/edit`);
  };

  const handleDelete = () => {
    setIsOpen(false);
    if (onDelete) {
      onDelete(profile.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={handleView}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={handleEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Profile
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProfileTable({ profiles, onDelete, selectedProfiles = [], onProfileSelectionChange }: ProfileTableProps) {
  const router = useRouter();

  const handleRowClick = (profileId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons, links, or checkboxes
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input[type="checkbox"]')) {
      return;
    }
    
    router.push(`/profiles/${profileId}`);
  };

  const handleSelectProfile = (profileId: string, checked: boolean) => {
    if (!onProfileSelectionChange) return;
    
    if (checked) {
      onProfileSelectionChange([...selectedProfiles, profileId]);
    } else {
      onProfileSelectionChange(selectedProfiles.filter(id => id !== profileId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onProfileSelectionChange) return;
    
    if (checked) {
      onProfileSelectionChange(profiles.map(p => p.id));
    } else {
      onProfileSelectionChange([]);
    }
  };

  const isAllSelected = profiles.length > 0 && selectedProfiles.length === profiles.length;
  const isSomeSelected = selectedProfiles.length > 0 && selectedProfiles.length < profiles.length;

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {onProfileSelectionChange && (
                    <th scope="col" className="py-3.5 pl-4 pr-2 sm:pl-6">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isSomeSelected;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                  )}
                  <th
                    scope="col"
                    className={`py-3.5 ${onProfileSelectionChange ? 'pl-2' : 'pl-4'} pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6`}
                  >
                    Profile
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Domain
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Skills
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {profiles.map((profile) => (
                  <tr 
                    key={profile.id}
                    onClick={(e) => handleRowClick(profile.id, e)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    {onProfileSelectionChange && (
                      <td className="py-4 pl-4 pr-2 sm:pl-6">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedProfiles.includes(profile.id)}
                            onChange={(e) => handleSelectProfile(profile.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                    )}
                    <td className={`whitespace-nowrap py-4 ${onProfileSelectionChange ? 'pl-2' : 'pl-4'} pr-3 text-sm sm:pl-6`}>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {profile.image ? (
                            <div className="relative h-10 w-10">
                              <Image
                                src={profile.image}
                                alt={`${profile.name}'s profile picture`}
                                fill
                                className="rounded-full object-cover"
                                sizes="40px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.classList.add('bg-gray-200');
                                    parent.classList.add('flex');
                                    parent.classList.add('items-center');
                                    parent.classList.add('justify-center');
                                    const fallback = document.createElement('span');
                                    fallback.className = 'text-sm font-bold text-gray-500';
                                    fallback.textContent = profile.name.split(' ').map(n => n[0]).join('');
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-500">
                                {profile.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 group-hover:text-indigo-600">
                            {profile.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {profile.department}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {profile.title}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-white"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {profile.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <ProfileActionsDropdown profile={profile} onDelete={onDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}