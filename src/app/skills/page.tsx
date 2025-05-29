'use client';

import { useState, useEffect } from 'react';
import { SkillsTable } from '@/components/skills/SkillsTable';
import Link from 'next/link';
import { Skill } from '@/types';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('Failed to fetch skills');
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Directory</h1>
          <p className="mt-2 text-gray-600">
            Browse and manage the organization&apos;s skills inventory.
          </p>
        </div>
        <Link
          href="/skills/manage"
          className="inline-flex items-center rounded-md border border-transparent bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Manage Skills
        </Link>
      </div>
      <SkillsTable skills={skills} />
    </div>
  );
} 