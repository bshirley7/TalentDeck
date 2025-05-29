'use client';

import { useState, useEffect } from 'react';
import { TalentProfile } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProfileSearchProps {
  profiles: TalentProfile[];
  onSearch: (filteredProfiles: TalentProfile[]) => void;
}

export function ProfileSearch({ profiles, onSearch }: ProfileSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [availability, setAvailability] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [skillFilterMode, setSkillFilterMode] = useState<'any' | 'all'>('any'); // OR vs AND logic
  
  // State for all available skills from database
  const [allAvailableSkills, setAllAvailableSkills] = useState<Array<{ id: string; name: string; category: string }>>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // State for all available domains from database
  const [allAvailableDomains, setAllAvailableDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);

  // Get unique departments for dropdown (filter out null/undefined) - DEPRECATED: Use API instead
  const departmentsFromProfiles = Array.from(new Set(
    profiles
      .map(p => p.department)
      .filter((dept): dept is string => dept != null && dept !== '')
  ));
  
  const availabilityOptions = ['Available', 'On Project', 'On Leave', 'Limited', 'Unavailable'];
  
  // Fetch all available skills from database on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const skillsData = await response.json();
        setAllAvailableSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setAllAvailableSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

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
  }, []);

  // Use all available domains from database, fallback to profile domains if needed
  const departments = allAvailableDomains.length > 0 ? allAvailableDomains : departmentsFromProfiles;

  // Get skill names for dropdown filtering
  const allSkills = allAvailableSkills.map(skill => skill.name).sort();

  // Filter skills based on search term and exclude already selected
  const filteredSkills = allSkills.filter(skill => 
    skill && skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDepartment('');
    setAvailability('');
    setSelectedSkills([]);
    setSkillSearch('');
  };

  useEffect(() => {
    const filteredProfiles = profiles.filter(profile => {
      // Text search (name, title, bio) - with null safety
      const matchesSearch = searchTerm === '' || 
        (profile.name && profile.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.title && profile.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.bio && profile.bio.toLowerCase().includes(searchTerm.toLowerCase()));

      // Department filter
      const matchesDepartment = department === '' || profile.department === department;

      // Availability filter
      const matchesAvailability = availability === '' || profile.availability?.status === availability;

      // Skills filter - either ANY (OR) or ALL (AND) selected skills
      const matchesSkills = selectedSkills.length === 0 || 
        (skillFilterMode === 'any' 
          ? selectedSkills.some(selectedSkill => 
              profile.skills?.some(skill => skill.name === selectedSkill)
            )
          : selectedSkills.every(selectedSkill => 
              profile.skills?.some(skill => skill.name === selectedSkill)
            )
        );

      return matchesSearch && matchesDepartment && matchesAvailability && matchesSkills;
    });

    onSearch(filteredProfiles);
  }, [searchTerm, department, availability, selectedSkills, skillFilterMode, profiles, onSearch]);

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
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
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
            className="mt-1 block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          >
            <option value="">All Statuses</option>
            {availabilityOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter - Simple Dropdown */}
        <div>
          <label htmlFor="skillSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <div className="relative">
            <input
              type="text"
              id="skillSearch"
              value={skillSearch}
              onChange={(e) => {
                setSkillSearch(e.target.value);
                setShowSkillDropdown(true);
              }}
              onFocus={() => setShowSkillDropdown(true)}
              onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
              placeholder={isLoadingSkills ? "Loading skills..." : "Search skills..."}
              disabled={isLoadingSkills}
              className="mt-1 block w-full h-10 px-3 pr-10 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowSkillDropdown(!showSkillDropdown)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>
            
            {/* Skills Dropdown */}
            {showSkillDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {isLoadingSkills ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    Loading skills...
                  </div>
                ) : filteredSkills.length > 0 ? (
                  <>
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gradient-primary hover:text-white transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                    {filteredSkills.length > 10 && (
                      <div className="px-3 py-2 text-xs text-gray-500 border-t">
                        {filteredSkills.length - 10} more skills available...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    {skillSearch ? `No skills found matching "${skillSearch}"` : 'Start typing to search skills...'}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-1">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-gradient-primary text-white px-2.5 py-0.5 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-white hover:text-gray-200 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Filter Mode Toggle */}
              {selectedSkills.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Match:</span>
                  <button
                    type="button"
                    onClick={() => setSkillFilterMode('any')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      skillFilterMode === 'any'
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Any skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillFilterMode('all')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      skillFilterMode === 'all'
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All skills
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchTerm || department || availability || selectedSkills.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-white">
              Search: {searchTerm}
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="ml-1 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {department && (
            <span className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-white">
              Domain: {department}
              <button
                type="button"
                onClick={() => setDepartment('')}
                className="ml-1 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {availability && (
            <span className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-white">
              Status: {availability}
              <button
                type="button"
                onClick={() => setAvailability('')}
                className="ml-1 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {selectedSkills.map((skill) => (
            <span key={skill} className="inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-medium text-white">
              Skill: {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-2 text-xs text-gradient-brand hover:text-gradient-brand-hover underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
} 