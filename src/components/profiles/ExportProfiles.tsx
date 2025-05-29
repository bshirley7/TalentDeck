'use client';

import React from 'react';
import { TalentProfile } from '@/types';
import { profilesToCSV, downloadCSV } from '@/lib/utils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportProfilesProps {
  profiles: TalentProfile[];
  className?: string;
}

export function ExportProfiles({ profiles, className = '' }: ExportProfilesProps) {
  const handleExportSelected = () => {
    if (profiles.length === 0) return;
    
    const csvContent = profilesToCSV(profiles);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `talent-profiles-selected-${timestamp}.csv`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleExportSelected}
        disabled={profiles.length === 0}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-primary rounded-md shadow-sm hover:bg-gradient-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        title="Export selected profiles"
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        Export Selected ({profiles.length})
      </button>
    </div>
  );
} 