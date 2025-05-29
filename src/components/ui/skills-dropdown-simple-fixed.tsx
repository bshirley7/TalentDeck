'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, X, Users, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: string;
}

export interface SelectedSkill {
  value: string;
  label: string;
  category?: string;
}

interface SkillsDropdownProps {
  skills: Skill[];
  profiles: { skills?: { name: string }[] }[];
  value: SelectedSkill[];
  onChange: (value: SelectedSkill[]) => void;
  placeholder?: string;
  className?: string;
  maxSelected?: number;
}

export function SkillsDropdown({
  skills,
  profiles,
  value,
  onChange,
  placeholder = "Add skills...",
  className,
  maxSelected = 10,
}: SkillsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter skills - keep it simple
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(skill => 
      !value.some(selected => selected.value === skill.name.toLowerCase())
    );

    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Add profile counts and limit results
    return filtered
      .map(skill => ({
        ...skill,
        profileCount: profiles.filter(profile =>
          profile.skills?.some(pSkill => 
            pSkill.name.toLowerCase() === skill.name.toLowerCase()
          )
        ).length
      }))
      .sort((a, b) => b.profileCount - a.profileCount)
      .slice(0, 15);
  }, [skills, value, searchTerm, profiles]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSkill = (skill: Skill, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🔥 NEW COMPONENT - Skill clicked:', skill.name);
    
    if (value.length >= maxSelected) {
      console.log('❌ Max skills reached');
      return;
    }
    
    const newSkill: SelectedSkill = {
      value: skill.name.toLowerCase(),
      label: skill.name,
      category: skill.category
    };
    
    console.log('✅ NEW COMPONENT - Adding skill:', newSkill);
    onChange([...value, newSkill]);
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillToRemove: SelectedSkill) => {
    onChange(value.filter(skill => skill.value !== skillToRemove.value));
  };

  console.log('🎯 SkillsDropdown component rendering with', skills.length, 'skills');

  return (
    <div ref={containerRef} className={cn("relative border-4 border-red-500 bg-red-50 p-2", className)}>
      {/* Main Container */}
      <div className="space-y-3">
        <div className="text-xs text-red-600 font-bold">NEW DROPDOWN COMPONENT LOADED</div>
        {/* Selected Skills Display */}
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge
              key={skill.value}
              variant="default"
              className="pr-1 py-1"
            >
              {skill.label}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1.5 rounded-full hover:bg-primary-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {/* Add Skills Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={value.length >= maxSelected}
            onClick={() => setOpen(!open)}
          >
            <Plus className="h-3 w-3 mr-1" />
            {value.length === 0 ? placeholder : 'Add more'}
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", open && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>

          {/* Skills List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  onMouseDown={(e) => handleSelectSkill(skill, e)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{skill.name}</div>
                      <div className="text-xs text-gray-500">{skill.category}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="h-3 w-3" />
                      {skill.profileCount}
                    </div>
                  </div>
                </div>
              ))
            ) : searchTerm ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No skills found matching &quot;{searchTerm}&quot;</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Start typing to search for skills...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 