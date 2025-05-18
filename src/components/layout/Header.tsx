'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSkillsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <svg width="32" height="32" viewBox="0 0 264 264" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M138.269 227.119L203.535 257.202C207.855 259.193 212.998 257.331 215.012 253.041L261.193 154.512C263.204 150.224 261.327 145.126 257.002 143.133L191.734 113.044C187.414 111.053 182.267 112.915 180.26 117.205L134.076 215.734C132.065 220.028 133.946 225.126 138.269 227.119ZM2.7062 146.658L46.0359 246.452C47.9233 250.798 53.0089 252.806 57.3917 250.937L98.9408 233.196L77.5759 238.833C67.9395 241.378 58.0534 235.684 55.4841 226.137L28.6767 126.241L7.22199 135.398C2.84578 137.267 0.818868 142.312 2.7062 146.658ZM36.4088 118.731L64.5863 223.731C65.8124 228.305 70.5466 231.024 75.1554 229.808L104.067 222.182C100.107 217.714 98.4783 211.381 100.309 205.258L118.097 145.841L74.4017 140.001C64.5157 138.68 57.5936 129.661 58.9194 119.871L61.1625 103.335L42.5339 108.248C37.9305 109.461 35.1827 114.16 36.4088 118.731ZM75.6623 130.748L120.813 136.782L124.661 123.931C120.783 124.14 116.622 123.926 112.276 123.239C91.8514 120.011 78.4312 108.608 80.5042 95.4921L80.9028 92.9699C81.3464 90.1631 82.8868 87.6475 85.1852 85.9765C87.4836 84.3055 90.3516 83.616 93.1584 84.0596L138.813 91.2754C143.115 88.4421 148.606 87.4487 153.944 89.0238L162.335 91.4946L171.337 25.2457C171.972 20.5631 168.653 16.243 163.93 15.6102L92.5935 6.07718C87.8779 5.44755 83.5181 8.73955 82.8832 13.4254L68.252 121.109C67.6138 125.798 70.9369 130.115 75.6623 130.748ZM125.657 38.5754C128.437 39.0148 131.103 39.9972 133.503 41.4668C135.902 42.9363 137.989 44.8642 139.644 47.1402C141.299 49.4163 142.489 51.996 143.147 54.7321C143.805 57.4682 143.917 60.307 143.478 63.0866C143.039 65.8661 142.056 68.5319 140.587 70.9317C139.117 73.3316 137.189 75.4185 134.913 77.0733C132.637 78.7281 130.057 79.9183 127.321 80.5761C124.585 81.234 121.746 81.3464 118.967 80.9071C113.353 80.0199 108.322 76.9391 104.98 72.3423C101.638 67.7456 100.259 62.0095 101.146 56.396C102.034 50.7825 105.114 45.7513 109.711 42.4093C114.308 39.0673 120.044 37.6882 125.657 38.5754Z" fill="currentColor" className="text-indigo-600"/>
                <path d="M140.525 103.75L135.006 122.185L109.341 207.911C107.986 212.448 110.592 217.212 115.168 218.564L123.936 221.148C123.612 217.947 124.161 214.721 125.53 211.804L171.717 113.272C173.119 110.267 175.34 107.707 178.127 105.884L151.265 97.9689C151.017 97.896 150.768 97.8347 150.519 97.7847C146.186 96.915 141.811 99.4587 140.525 103.75Z" fill="currentColor" className="text-indigo-600"/>
              </svg>
            </div>
            <Link href="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors">
              TalentDeck
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/profiles"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profiles') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Profiles
            </Link>
            
            {/* Skills Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${
                  isActive('/skills') || isActive('/skills/manage')
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
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
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu">
                    <Link
                      href="/skills"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive('/skills')
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsSkillsOpen(false)}
                    >
                      Browse Skills
                    </Link>
                    <Link
                      href="/skills/manage"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive('/skills/manage')
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/import') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Import
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 