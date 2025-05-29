'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, X, Users } from 'lucide-react';
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
      .slice(0, 20);
  }, [skills, value, searchTerm, profiles]);

  const handleSelectSkill = (skill: Skill) => {
    console.log('🔥 Skill clicked:', skill.name);
    
    if (value.length >= maxSelected) {
      console.log('❌ Max skills reached');
      return;
    }
    
    const newSkill: SelectedSkill = {
      value: skill.name.toLowerCase(),
      label: skill.name,
      category: skill.category
    };
    
    console.log('✅ Adding skill:', newSkill);
    onChange([...value, newSkill]);
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillToRemove: SelectedSkill) => {
    onChange(value.filter(skill => skill.value !== skillToRemove.value));
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Skills</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
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

              {/* Skills List - Simplified */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleSelectSkill(skill)}
                    className="p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className="text-xs text-muted-foreground">{skill.category}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {skill.profileCount}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredSkills.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                         <p>No skills found matching &quot;{searchTerm}&quot;</p>
                  </div>
                )}
                
                {filteredSkills.length === 0 && !searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Start typing to search for skills...</p>
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