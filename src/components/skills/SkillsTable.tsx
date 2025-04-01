import { Skill } from '@/types';
import Link from 'next/link';

interface SkillsTableProps {
  skills: Skill[];
}

export function SkillsTable({ skills }: SkillsTableProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedSkills).sort();

  return (
    <div className="space-y-8">
      {sortedCategories.map((category) => (
        <div key={category} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{category}</h3>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedSkills[category].map((skill) => (
                  <div
                    key={skill.id}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{skill.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">Proficiency: {skill.proficiency}</p>
                      </div>
                      <Link
                        href={`/skills/${skill.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 