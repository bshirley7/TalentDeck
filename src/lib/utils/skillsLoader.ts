import fs from 'fs';
import path from 'path';
import { Skill } from '@/types';

/**
 * Parses the SKILLS.md file and generates skill data
 * @returns Array of skills with generated IDs and default proficiency
 */
export function parseSkillsMarkdown(): Skill[] {
  const skillsFilePath = path.join(process.cwd(), 'SKILLS.md');
  const content = fs.readFileSync(skillsFilePath, 'utf-8');
  
  const skills: Skill[] = [];
  let currentCategory = '';
  
  // Split content into lines and process each line
  content.split('\n').forEach((line) => {
    // Skip empty lines
    if (!line.trim()) return;
    
    // Check if line is a category header (starts with ##)
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      return;
    }
    
    // Check if line is a skill (starts with -)
    if (line.startsWith('- ')) {
      const skillName = line.replace('- ', '').trim();
      if (skillName && currentCategory) {
        skills.push({
          id: generateSkillId(skillName),
          name: skillName,
          category: currentCategory,
          proficiency: 'Intermediate', // Default proficiency level
        });
      }
    }
  });
  
  return skills;
}

/**
 * Generates a unique ID for a skill based on its name
 * @param name The skill name
 * @returns A unique ID string
 */
function generateSkillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 