'use client';

import { useState, useEffect } from 'react';
import { TalentProfile } from '@/types';

interface ProfileSearchProps {
  profiles: TalentProfile[];
  onSearch: (filteredProfiles: TalentProfile[]) => void;
}

export function ProfileSearch({ profiles, onSearch }: ProfileSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [availability, setAvailability] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  // Get unique departments and skills for dropdowns
  const departments = Array.from(new Set(profiles.map(p => p.department)));
  const skills = Array.from(new Set(profiles.flatMap(p => p.skills.map(s => s.name))));
  const availabilityOptions = ['Available', 'Busy', 'Away'];

  useEffect(() => {
    const filteredProfiles = profiles.filter(profile => {
      const matchesSearch = searchTerm === '' || 
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = department === '' || 
        profile.department === department;

      const matchesAvailability = availability === '' || 
        profile.availability.status === availability;

      const matchesSkill = skillFilter === '' || 
        profile.skills.some(skill => 
          skill.name.toLowerCase().includes(skillFilter.toLowerCase())
        );

      return matchesSearch && matchesDepartment && matchesAvailability && matchesSkill;
    });

    onSearch(filteredProfiles);
  }, [searchTerm, department, availability, skillFilter, profiles, onSearch]);

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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Domains</option>
            {departments.map((dept) => (
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {availabilityOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills
          </label>
          <select
            id="skills"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Skills</option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || department || availability || skillFilter) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
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
          {skillFilter && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Skill: {skillFilter}
              <button
                onClick={() => setSkillFilter('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 