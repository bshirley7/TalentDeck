'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Spectrum
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/profiles"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profiles
            </Link>
            
            {/* Skills Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              >
                <span>Skills</span>
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${
                    isSkillsOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {isSkillsOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    <Link
                      href="/skills"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsSkillsOpen(false)}
                    >
                      Browse Skills
                    </Link>
                    <Link
                      href="/skills/manage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsSkillsOpen(false)}
                    >
                      Manage Skills
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/import"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Import
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 