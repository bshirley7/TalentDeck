import { Skill } from '@/types';
import { Badge } from "@/components/ui/badge";

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
              <div className="flex flex-wrap gap-1.5">
                {groupedSkills[category].map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 