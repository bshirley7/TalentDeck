import { parseSkillsMarkdown } from '../src/lib/utils/skillsLoader';
import { DataStore } from '../src/lib/store';

async function loadSkills() {
  try {
    // Parse skills from markdown
    const skills = parseSkillsMarkdown();
    
    // Get the data store instance
    const store = DataStore.getInstance();
    
    // Clear existing skills
    store.clearSkills();
    
    // Add new skills
    skills.forEach(skill => {
      store.addSkill(skill);
    });
    
    console.log(`Successfully loaded ${skills.length} skills`);
  } catch (error) {
    console.error('Failed to load skills:', error);
    process.exit(1);
  }
}

// Run the script
loadSkills(); 