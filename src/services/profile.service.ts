import { Database } from 'better-sqlite3';
import { Profile, ProfileSkill } from '../database/models/types';
import { SkillsService } from './skills.service';

export class ProfileService {
    private db: Database;
    private skillsService: SkillsService;

    constructor(db: Database) {
        this.db = db;
        this.skillsService = new SkillsService(db);
    }

    /**
     * Add skills to a profile with validation
     */
    addProfileSkills(profileId: string, skills: { skillId: string; proficiency: string }[]): void {
        // Validate all skills exist
        const skillIds = skills.map(s => s.skillId);
        const existingSkills = this.skillsService.getSkillsByIds(skillIds);
        
        if (existingSkills.length !== skillIds.length) {
            throw new Error('One or more skills do not exist in the database');
        }

        // Begin transaction
        const transaction = this.db.transaction((skills: { skillId: string; proficiency: string }[]) => {
            for (const skill of skills) {
                this.db.prepare(`
                    INSERT INTO profile_skills (profile_id, skill_id, proficiency)
                    VALUES (?, ?, ?)
                `).run(profileId, skill.skillId, skill.proficiency);
            }
        });

        // Execute transaction
        transaction(skills);
    }

    /**
     * Update profile skills
     */
    updateProfileSkills(profileId: string, skills: { skillId: string; proficiency: string }[]): void {
        // Validate all skills exist
        const skillIds = skills.map(s => s.skillId);
        const existingSkills = this.skillsService.getSkillsByIds(skillIds);
        
        if (existingSkills.length !== skillIds.length) {
            throw new Error('One or more skills do not exist in the database');
        }

        // Begin transaction
        const transaction = this.db.transaction((skills: { skillId: string; proficiency: string }[]) => {
            // Remove existing skills
            this.db.prepare('DELETE FROM profile_skills WHERE profile_id = ?').run(profileId);
            
            // Add new skills
            for (const skill of skills) {
                this.db.prepare(`
                    INSERT INTO profile_skills (profile_id, skill_id, proficiency)
                    VALUES (?, ?, ?)
                `).run(profileId, skill.skillId, skill.proficiency);
            }
        });

        // Execute transaction
        transaction(skills);
    }

    /**
     * Get profile skills
     */
    getProfileSkills(profileId: string): ProfileSkill[] {
        return this.db.prepare(`
            SELECT ps.*, s.name as skill_name, c.name as category_name
            FROM profile_skills ps
            JOIN skills s ON ps.skill_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            WHERE ps.profile_id = ?
            ORDER BY c.name, s.name
        `).all(profileId);
    }

    /**
     * Remove skills from a profile
     */
    removeProfileSkills(profileId: string, skillIds: string[]): void {
        const placeholders = skillIds.map(() => '?').join(',');
        this.db.prepare(`
            DELETE FROM profile_skills 
            WHERE profile_id = ? AND skill_id IN (${placeholders})
        `).run(profileId, ...skillIds);
    }

    /**
     * Get all profiles with their skills
     */
    getAllProfiles(): Profile[] {
        return this.db.prepare(`
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT s.name) as skills,
                   GROUP_CONCAT(DISTINCT c.name) as categories
            FROM profiles p
            LEFT JOIN profile_skills ps ON p.id = ps.profile_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            GROUP BY p.id
            ORDER BY p.name
        `).all();
    }
} 