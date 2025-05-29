'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, X, Sparkles, Users, Filter } from 'lucide-react';
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

interface SkillsCommandPaletteProps {
  skills: Skill[];
  profiles: { skills?: { name: string }[] }[];
  value: SelectedSkill[];
  onChange: (value: SelectedSkill[]) => void;
  placeholder?: string;
  className?: string;
  maxSelected?: number;
}

export function SkillsCommandPalette({
  skills,
  profiles,
  value,
  onChange,
  placeholder = "Add skills...",
  className,
  maxSelected = 10,
}: SkillsCommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(skills.map(skill => skill.category)));
    return uniqueCategories.sort();
  }, [skills]);

  // Filter and rank skills
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(skill => 
      !value.some(selected => selected.value === skill.name.toLowerCase())
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Sort by relevance: exact matches first, then by profile count
    return filtered
      .map(skill => ({
        ...skill,
        profileCount: profiles.filter(profile =>
          profile.skills?.some(pSkill => 
            pSkill.name.toLowerCase() === skill.name.toLowerCase()
          )
        ).length,
        isExactMatch: skill.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      }))
      .sort((a, b) => {
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        return b.profileCount - a.profileCount;
      })
      .slice(0, 50); // Limit results for performance
  }, [skills, value, searchTerm, selectedCategory, profiles]);

  // Get popular skills
  const popularSkills = useMemo(() => {
    return skills
      .map(skill => ({
        ...skill,
        profileCount: profiles.filter(profile =>
          profile.skills?.some(pSkill => 
            pSkill.name.toLowerCase() === skill.name.toLowerCase()
          )
        ).length
      }))
      .filter(skill => 
        !value.some(selected => selected.value === skill.name.toLowerCase()) &&
        skill.profileCount > 0
      )
      .sort((a, b) => b.profileCount - a.profileCount)
      .slice(0, 8);
  }, [skills, profiles, value]);

  const handleSelectSkill = (skill: Skill) => {
    if (value.length >= maxSelected) return;
    
    const newSkill: SelectedSkill = {
      value: skill.name.toLowerCase(),
      label: skill.name,
      category: skill.category
    };
    
    onChange([...value, newSkill]);
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillToRemove: SelectedSkill) => {
    onChange(value.filter(skill => skill.value !== skillToRemove.value));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className={cn("space-y-3", className)}>
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={value.length >= maxSelected}
            >
              <Plus className="h-3 w-3 mr-1" />
              {value.length === 0 ? placeholder : 'Add more'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Skills
                <Badge variant="secondary" className="ml-auto">
                  {value.length}/{maxSelected}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 flex-1 overflow-hidden">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                  className="h-6 px-2 text-xs"
                >
                  All Categories
                </Button>
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-6 px-2 text-xs"
                  >
                    {category}
                  </Button>
                ))}
                {(searchTerm || selectedCategory) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Popular Skills (shown when no search) */}
              {!searchTerm && !selectedCategory && popularSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    Popular Skills
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {popularSkills.map((skill) => (
                      <Button
                        key={skill.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectSkill(skill)}
                        className="justify-between h-auto py-2 px-3"
                      >
                        <span className="text-left">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-xs text-muted-foreground">{skill.category}</div>
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {skill.profileCount}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto space-y-1">
                {filteredSkills.map((skill) => (
                  <Button
                    key={skill.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectSkill(skill)}
                    className="w-full justify-between h-auto py-2 px-3"
                  >
                    <span className="text-left">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">{skill.category}</div>
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {skill.profileCount}
                    </div>
                  </Button>
                ))}
                
                {filteredSkills.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No skills found matching &quot;{searchTerm}&quot;</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 