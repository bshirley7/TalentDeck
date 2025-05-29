'use client';

import React, { useState, useRef, useEffect } from 'react';import { Badge } from '@/components/ui/badge';import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
}

interface SimpleMultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  maxSelected?: number;
  className?: string;
  disabled?: boolean;
  creatable?: boolean;
}

export function SimpleMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  maxSelected,
  className,
  disabled = false,
  creatable = false,
}: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term and remove already selected
  const filteredOptions = options.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadySelected = !value.find(selected => selected.value === option.value);
    return matchesSearch && notAlreadySelected;
  });

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (option: Option) => {
    if (maxSelected && value.length >= maxSelected) {
      return;
    }
    onChange([...value, option]);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemoveOption = (optionToRemove: Option) => {
    onChange(value.filter(option => option.value !== optionToRemove.value));
  };

  const handleCreateOption = () => {
    if (!creatable || !searchTerm.trim()) return;
    
    const newOption: Option = {
      value: searchTerm.toLowerCase(),
      label: searchTerm.trim()
    };
    
    // Check if option already exists
    const exists = options.find(opt => opt.value === newOption.value) || 
                   value.find(opt => opt.value === newOption.value);
    
    if (!exists) {
      handleSelectOption(newOption);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && creatable && searchTerm.trim() && filteredOptions.length === 0) {
      e.preventDefault();
      handleCreateOption();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Backspace' && !searchTerm && value.length > 0) {
      // Remove last selected option if input is empty
      handleRemoveOption(value[value.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-1">
          {/* Selected options as badges */}
          {value.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="mr-1 mb-1 pr-1"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveOption(option);
                }}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none"
            disabled={disabled}
          />
        </div>
        
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  onClick={() => handleSelectOption(option)}
                >
                  {option.label}
                </button>
              ))
            ) : searchTerm && creatable ? (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                onClick={handleCreateOption}
              >
                Create &quot;{searchTerm}&quot;
              </button>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 