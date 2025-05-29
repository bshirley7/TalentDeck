'use client';

import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
}

interface HeadlessMultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function HeadlessMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: HeadlessMultiSelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = 
    query === ''
      ? options.filter(option => !value.find(selected => selected.value === option.value))
      : options.filter((option) => {
          const matchesQuery = option.label.toLowerCase().includes(query.toLowerCase());
          const notSelected = !value.find(selected => selected.value === option.value);
          return matchesQuery && notSelected;
        });

  const handleSelect = (option: Option) => {
    onChange([...value, option]);
    setQuery('');
  };

  const handleRemove = (optionToRemove: Option) => {
    onChange(value.filter(option => option.value !== optionToRemove.value));
  };

  return (
    <div className={cn("relative", className)}>
      <Combobox value={null} onChange={handleSelect} disabled={disabled}>
        <div className="relative">
          {/* Display selected items */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {value.map((option) => (
                <Badge key={option.value} variant="secondary" className="pr-1">
                  {option.label}
                  <button
                    type="button"
                    onClick={() => handleRemove(option)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    disabled={disabled}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={() => ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
} 