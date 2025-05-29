import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { SkillsService } from '@/services/skills.service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Initialize database
    await initializeDatabase();
    const skillsService = SkillsService.getInstance();
    await skillsService.initialize();

    // Read and parse CSV
    const text = await file.text();
    const rows = text.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1);

    // Process each row
    const results = await Promise.all(data.map(async (row) => {
      const contact = {
        name: row[headers.indexOf('name')]?.trim() || '',
        title: row[headers.indexOf('title')]?.trim() || '',
        department: row[headers.indexOf('department')]?.trim() || '',
        email: row[headers.indexOf('email')]?.trim() || '',
        phone: row[headers.indexOf('phone')]?.trim() || '',
        skills: row[headers.indexOf('skills')]?.trim() || '',
        skillCategories: row[headers.indexOf('skillCategories')]?.trim() || '',
        skillProficiencies: row[headers.indexOf('skillProficiencies')]?.trim() || '',
      };

      // Process skills
      if (contact.skills) {
        const skills = contact.skills.split(',').map(s => s.trim());
        const categories = (contact.skillCategories || '').split(',').map(c => c.trim());
        const proficiencies = (contact.skillProficiencies || '').split(',').map(p => p.trim());

        const processedSkills = [];
        for (let i = 0; i < skills.length; i++) {
          const skillName = skills[i];
          const category = categories[i] || 'Uncategorized';
          const proficiency = proficiencies[i] || 'Intermediate';

          // Check if skill exists
          const existingSkills = await skillsService.searchSkills(skillName);
          let skill = existingSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());

          if (!skill) {
            // Add new skill
            skill = await skillsService.addSkill({
              name: skillName,
              category: category,
              proficiency: proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            });
          }

          processedSkills.push({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            proficiency: proficiency
          });
        }

        return {
          ...contact,
          processedSkills
        };
      }

      return contact;
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'CSV processed successfully',
      data: results 
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
} 