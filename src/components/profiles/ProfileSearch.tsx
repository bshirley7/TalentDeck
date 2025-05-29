'use client';

import { useState, useEffect } from 'react';
import { TalentProfile } from '@/types';
import { SkillsDropdown, SelectedSkill } from '@/components/ui/test-component';

interface ProfileSearchProps {
  profiles: TalentProfile[];
  onSearch: (filteredProfiles: TalentProfile[]) => void;
}

export function ProfileSearch({ profiles, onSearch }: ProfileSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [availability, setAvailability] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  // State for all available domains from database
  const [allAvailableDomains, setAllAvailableDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);

  // Get unique departments - DEPRECATED: Use API instead
  const departmentsFromProfiles = Array.from(new Set(profiles.map(p => p.department)));
  const availabilityOptions = ['Available', 'Busy', 'Away'];

  // Fetch all available domains from database on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setIsLoadingDomains(true);
        const response = await fetch('/api/domains');
        if (!response.ok) {
          throw new Error('Failed to fetch domains');
        }
        const domainsData = await response.json();
        setAllAvailableDomains(domainsData);
      } catch (error) {
        console.error('Error fetching domains:', error);
        // Fallback to domains from profiles if API fails
        setAllAvailableDomains(departmentsFromProfiles);
      } finally {
        setIsLoadingDomains(false);
      }
    };

    fetchDomains();
  }, []); // Remove departmentsFromProfiles dependency to prevent infinite loop

  // Use all available domains from database, fallback to profile domains if needed
  const departments = allAvailableDomains.length > 0 ? allAvailableDomains : departmentsFromProfiles;

  useEffect(() => {
    const filteredProfiles = profiles.filter(profile => {
      const matchesSearch = searchTerm === '' || 
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = department === '' || 
        profile.department === department;

      const matchesAvailability = availability === '' || 
        profile.availability.status === availability;

      // Check if profile has any of the selected skills
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(selectedSkill => 
          profile.skills?.some(skill => 
            skill.name.toLowerCase() === selectedSkill.value
          )
        );

      return matchesSearch && matchesDepartment && matchesAvailability && matchesSkills;
    });

    onSearch(filteredProfiles);
  }, [searchTerm, department, availability, selectedSkills, profiles, onSearch]);

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or title..."
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Domain
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={isLoadingDomains}
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">
              {isLoadingDomains ? "Loading domains..." : "All Domains"}
            </option>
            {!isLoadingDomains && departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {availabilityOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter - Dropdown */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <SkillsDropdown value={selectedSkills} onChange={setSelectedSkills} />
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || department || availability || selectedSkills.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-blue-100">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 text-gradient-primary hover:text-gradient-primary-hover"
              >
                ×
              </button>
            </span>
          )}
          {department && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Domain: {department}
              <button
                onClick={() => setDepartment('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {availability && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Status: {availability}
              <button
                onClick={() => setAvailability('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedSkills.map((skill) => (
            <span key={skill.value} className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Skill: {skill.label}
              <button
                onClick={() => setSelectedSkills(prev => prev.filter(s => s.value !== skill.value))}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setSearchTerm('');
              setDepartment('');
              setAvailability('');
              setSelectedSkills([]);
            }}
            className="ml-2 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
} 