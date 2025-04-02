import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SKILLS_FILE_PATH = path.join(DATA_DIR, 'skills.json');
const CATEGORIES_FILE_PATH = path.join(DATA_DIR, 'categories.json');

// Read the current skills data
const skillsData = JSON.parse(fs.readFileSync(SKILLS_FILE_PATH, 'utf-8'));

// Debug: Print all skills
console.log('All skills:', skillsData.skills.map((s: any) => s.name));

// Filter out any skills that start with "Category:" or are invalid
const cleanedSkills = skillsData.skills.filter((skill: any) => {
  const isValid = !skill.name.startsWith('Category:') && 
                 skill.name.trim() !== '' && 
                 skill.category && 
                 skill.category.trim() !== '';
  
  if (!isValid) {
    console.log('Removing invalid skill:', skill);
  }
  
  return isValid;
});

// Get unique categories from the cleaned skills
const uniqueCategories = Array.from(new Set(cleanedSkills.map((skill: any) => skill.category)));

// Ensure "Uncategorized" is in the categories
if (!uniqueCategories.includes('Uncategorized')) {
  uniqueCategories.push('Uncategorized');
}

// Save the cleaned skills data
fs.writeFileSync(SKILLS_FILE_PATH, JSON.stringify({ skills: cleanedSkills }, null, 2));

// Save the categories data
fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify({ categories: uniqueCategories }, null, 2));

console.log('\nMigration completed successfully');
console.log(`Cleaned ${skillsData.skills.length - cleanedSkills.length} invalid skills`);
console.log(`Found ${uniqueCategories.length} unique categories`);
console.log('\nCategories:', uniqueCategories); 