/**
 * Create and populate the missing skills table
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

async function createSkillsTable() {
    try {
        console.log('🔄 Creating skills table...');
        
        const db = new DatabaseSync('talentdeck.db');
        
        // Create skills table
        db.exec(`
            CREATE TABLE IF NOT EXISTS skills (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                proficiency TEXT
            )
        `);
        
        console.log('✅ Skills table created');
        
        // Get unique skills from profile_skills
        const existingSkills = db.prepare('SELECT DISTINCT skill_id FROM profile_skills').all();
        console.log(`📊 Found ${existingSkills.length} skill references in profile_skills`);
        
        // Read original profiles.json to get skill details
        const profilesPath = path.join(process.cwd(), 'data', 'profiles.json');
        const profilesData = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));
        
        // Collect all unique skills from profiles
        const skillsMap = new Map();
        
        for (const profile of profilesData.profiles || []) {
            if (profile.skills) {
                for (const skill of profile.skills) {
                    if (skill.id && skill.name) {
                        skillsMap.set(skill.id, {
                            id: skill.id,
                            name: skill.name,
                            category: skill.category || 'General',
                            proficiency: skill.proficiency || 'Intermediate'
                        });
                    }
                }
            }
        }
        
        console.log(`📋 Found ${skillsMap.size} unique skills to insert`);
        
        // Insert skills
        const insertSkill = db.prepare(`
            INSERT OR REPLACE INTO skills (id, name, category, proficiency)
            VALUES (?, ?, ?, ?)
        `);
        
        let skillCount = 0;
        for (const skill of skillsMap.values()) {
            insertSkill.run(skill.id, skill.name, skill.category, skill.proficiency);
            skillCount++;
        }
        
        console.log(`✅ Inserted ${skillCount} skills`);
        
        // Verify the data
        const totalSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get();
        const totalProfileSkills = db.prepare('SELECT COUNT(*) as count FROM profile_skills').get();
        
        console.log(`📊 Final counts:`);
        console.log(`   - Skills: ${totalSkills.count}`);
        console.log(`   - Profile-skill relationships: ${totalProfileSkills.count}`);
        
        db.close();
        console.log('✅ Skills table creation complete');
        
    } catch (error) {
        console.error('❌ Skills table creation failed:', error);
    }
}

createSkillsTable(); 