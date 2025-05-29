'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';import { X, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectedSkill {
  value: string;
  label: string;
}

interface SkillsTagInputProps {
  skills: { name: string; category: string }[];
  value: SelectedSkill[];
  onChange: (value: SelectedSkill[]) => void;
  placeholder?: string;
  className?: string;
  maxSelected?: number;
}

export function SkillsTagInput({
  skills,
  value,
  onChange,
  placeholder = "Type skills and press Enter...",
  className,
  maxSelected = 10,
}: SkillsTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; category: string }[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = skills
        .filter(skill => 
          skill.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.some(selected => selected.value === skill.name.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, skills, value]);

  const handleAddSkill = (skillName: string) => {
    if (!skillName.trim() || value.length >= maxSelected) return;
    
    const existingSkill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    const newSkill: SelectedSkill = {
      value: skillName.toLowerCase(),
      label: existingSkill?.name || skillName.trim()
    };
    
    // Don't add duplicates
    if (value.some(s => s.value === newSkill.value)) return;
    
    onChange([...value, newSkill]);
    setInputValue('');
    setSuggestions([]);
  };

  const handleRemoveSkill = (skillToRemove: SelectedSkill) => {
    onChange(value.filter(skill => skill.value !== skillToRemove.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleAddSkill(suggestions[activeSuggestionIndex].name);
      } else if (inputValue.trim()) {
        handleAddSkill(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last skill if input is empty
      handleRemoveSkill(value[value.length - 1]);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddSkill(inputValue.trim());
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main input area */}
      <div className={cn(
        "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}>
        <div className="flex flex-wrap items-center gap-1">
          {/* Selected skills */}
          {value.map((skill) => (
            <Badge
              key={skill.value}
              variant="secondary"
              className="mr-1 mb-1 pr-1"
            >
              {skill.label}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {/* Input */}
          <div className="flex items-center flex-1 min-w-[120px]">
            <Hash className="h-3 w-3 text-muted-foreground mr-1" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : "Add more..."}
              className="flex-1 bg-transparent outline-none text-sm"
              disabled={value.length >= maxSelected}
            />
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
          <div className="py-1">
            {suggestions.map((skill, index) => (
              <button
                key={skill.name}
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                  index === activeSuggestionIndex && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleAddSkill(skill.name)}
              >
                <div className="font-medium">{skill.name}</div>
                <div className="text-xs text-muted-foreground">{skill.category}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      {value.length === 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          Type skills and press Enter, comma, or semicolon to add them
        </p>
      )}
    </div>
  );
} 