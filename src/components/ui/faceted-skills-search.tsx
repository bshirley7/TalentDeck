'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, X, Users } from 'lucide-react';
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
  proficiency?: string;
}

interface Profile {  skills?: { name: string; proficiency?: string; category?: string }[];}interface FacetedSkillsSearchProps {  skills: Skill[];  profiles: Profile[];  value: SelectedSkill[];  onChange: (value: SelectedSkill[]) => void;  placeholder?: string;  className?: string;  maxSelected?: number;}

export function FacetedSkillsSearch({
  skills,
  profiles,
  value,
  onChange,
  placeholder = "Search skills...",
  className,
  maxSelected = 10,
}: FacetedSkillsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group skills by category and filter based on search
  const skillsByCategory = useMemo(() => {
    const filtered = skills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.some(selected => selected.value === skill.name.toLowerCase())
    );

    const grouped = filtered.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    // Sort categories by number of skills
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b.length - a.length)
      .reduce((acc, [category, categorySkills]) => {
        acc[category] = categorySkills.sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      }, {} as Record<string, Skill[]>);
  }, [skills, searchTerm, value]);

    // Count how many profiles have each skill  const getSkillCount = (skillName: string) => {    return profiles.filter(profile =>       profile.skills?.some((skill) =>         skill.name.toLowerCase() === skillName.toLowerCase()      )    ).length;  };

  // Get suggested skills based on current selection
  const getSuggestedSkills = () => {
    if (value.length === 0) return [];
    
    const relatedSkills = new Map<string, number>();
    
    value.forEach(selectedSkill => {
      // Find profiles that have this skill
      const profilesWithSkill = profiles.filter(profile =>
        profile.skills?.some((skill: any) => 
          skill.name.toLowerCase() === selectedSkill.value
        )
      );
      
      // Count other skills these profiles have
      profilesWithSkill.forEach(profile => {
        profile.skills?.forEach((skill: any) => {
          const skillKey = skill.name.toLowerCase();
          if (!value.some(s => s.value === skillKey)) {
            relatedSkills.set(skillKey, (relatedSkills.get(skillKey) || 0) + 1);
          }
        });
      });
    });
    
    return Array.from(relatedSkills.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([skillName]) => 
        skills.find(skill => skill.name.toLowerCase() === skillName)
      )
      .filter(Boolean) as Skill[];
  };

  const handleSelectSkill = (skill: Skill) => {
    if (value.length >= maxSelected) return;
    
    const newSkill: SelectedSkill = {
      value: skill.name.toLowerCase(),
      label: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    };
    
    onChange([...value, newSkill]);
  };

  const handleRemoveSkill = (skillToRemove: SelectedSkill) => {
    onChange(value.filter(skill => skill.value !== skillToRemove.value));
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const suggestedSkills = getSuggestedSkills();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Selected Skills */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Selected Skills ({value.length})</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {value.map((skill) => (
              <Badge
                key={skill.value}
                variant="default"
                className="pr-1"
              >
                {skill.label}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 rounded-full hover:bg-primary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">People with these skills also have:</span>
          <div className="flex flex-wrap gap-1">
            {suggestedSkills.map((skill) => (
              <Button
                key={skill.id}
                variant="outline"
                size="sm"
                onClick={() => handleSelectSkill(skill)}
                className="h-6 px-2 text-xs"
              >
                {skill.name}
                <span className="ml-1 text-muted-foreground">
                  ({getSkillCount(skill.name)})
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Skills by Category */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <Collapsible
            key={category}
            open={expandedCategories.has(category)}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {categorySkills.length}
                  </Badge>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedCategories.has(category) && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-1">
              {categorySkills.map((skill) => {
                const count = getSkillCount(skill.name);
                return (
                  <Button
                    key={skill.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectSkill(skill)}
                    className="w-full justify-between px-4 py-1.5 h-auto text-left"
                    disabled={value.length >= maxSelected}
                  >
                    <span className="text-sm">{skill.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {count}
                    </div>
                  </Button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {Object.keys(skillsByCategory).length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No skills found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
} 