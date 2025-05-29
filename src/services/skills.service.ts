/**
 * SkillsService - Database-backed skills management
 * Migrated from JSON file storage to SQLite database
 */

import { initializeDatabase, getDatabase } from '../lib/db';

export interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillCategory {
    name: string;
    count?: number;
}

export class SkillsService {
    private static instance: SkillsService;
    private initialized = false;

    private constructor() {}

    static getInstance(): SkillsService {
        if (!SkillsService.instance) {
            SkillsService.instance = new SkillsService();
        }
        return SkillsService.instance;
    }

    /**
     * Initialize database connection
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;
        
        try {
            await initializeDatabase();
            this.initialized = true;
            console.log('✅ SkillsService initialized with database connection');
        } catch (error) {
            console.error('❌ Failed to initialize SkillsService:', error);
            throw error;
        }
    }

    /**
     * Get all available skills from database
     */
    async getAllSkills(): Promise<Skill[]> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare('SELECT id, name, category, proficiency FROM skills ORDER BY name');
            const rows = stmt.all() as Array<{
                id: string;
                name: string;
                category: string;
                proficiency: string;
            }>;
            
            return rows.map(row => ({
                id: row.id,
                name: row.name,
                category: row.category,
                proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            }));
        } catch (error) {
            console.error('Error getting all skills:', error);
            throw error;
        }
    }

    /**
     * Get skills by category
     */
    async getSkillsByCategory(category: string): Promise<Skill[]> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare('SELECT id, name, category, proficiency FROM skills WHERE category = ? ORDER BY name');
            const rows = stmt.all(category) as Array<{
                id: string;
                name: string;
                category: string;
                proficiency: string;
            }>;
            
            return rows.map(row => ({
                id: row.id,
                name: row.name,
                category: row.category,
                proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            }));
        } catch (error) {
            console.error(`Error getting skills for category ${category}:`, error);
            throw error;
        }
    }

    /**
     * Get all skill categories
     */
    async getSkillCategories(): Promise<SkillCategory[]> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare(`
                SELECT category, COUNT(*) as count 
                FROM skills 
                GROUP BY category 
                ORDER BY category
            `);
            const rows = stmt.all() as Array<{
                category: string;
                count: number;
            }>;
            
            return rows.map(row => ({
                name: row.category,
                count: row.count
            }));
        } catch (error) {
            console.error('Error getting skill categories:', error);
            throw error;
        }
    }

    /**
     * Add new skill to database
     */
    async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const id = this.generateId();
            
            const stmt = db.prepare(`
                INSERT INTO skills (id, name, category, proficiency)
                VALUES (?, ?, ?, ?)
            `);
            
            stmt.run(id, skill.name, skill.category, skill.proficiency);
            
            return {
                id,
                ...skill
            };
        } catch (error) {
            console.error('Error adding skill:', error);
            throw error;
        }
    }

    /**
     * Update existing skill
     */
    async updateSkill(id: string, skillData: Partial<Omit<Skill, 'id'>>): Promise<Skill | null> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            
            const stmt = db.prepare(`
                UPDATE skills 
                SET name = COALESCE(?, name),
                    category = COALESCE(?, category),
                    proficiency = COALESCE(?, proficiency)
                WHERE id = ?
            `);
            
            const result = stmt.run(
                skillData.name,
                skillData.category,
                skillData.proficiency,
                id
            );
            
            if (result.changes === 0) {
                return null;
            }
            
            return await this.getSkillById(id);
        } catch (error) {
            console.error(`Error updating skill ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete skill from database
     */
    async deleteSkill(id: string): Promise<boolean> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare('DELETE FROM skills WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error(`Error deleting skill ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get skill by ID
     */
    async getSkillById(id: string): Promise<Skill | null> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare('SELECT id, name, category, proficiency FROM skills WHERE id = ?');
            const row = stmt.get(id) as {
                id: string;
                name: string;
                category: string;
                proficiency: string;
            } | undefined;
            
            if (!row) {
                return null;
            }
            
            return {
                id: row.id,
                name: row.name,
                category: row.category,
                proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            };
        } catch (error) {
            console.error(`Error getting skill ${id}:`, error);
            throw error;
        }
    }

    /**
     * Search skills by name
     */
    async searchSkills(query: string): Promise<Skill[]> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare(`
                SELECT id, name, category, proficiency 
                FROM skills 
                WHERE name LIKE ? OR category LIKE ?
                ORDER BY name
            `);
            
            const searchTerm = `%${query}%`;
            const rows = stmt.all(searchTerm, searchTerm) as Array<{
                id: string;
                name: string;
                category: string;
                proficiency: string;
            }>;
            
            return rows.map(row => ({
                id: row.id,
                name: row.name,
                category: row.category,
                proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            }));
        } catch (error) {
            console.error(`Error searching skills with query "${query}":`, error);
            throw error;
        }
    }

    /**
     * Validate skill exists in database
     */
    async validateSkill(skillId: string): Promise<boolean> {
        try {
            const skill = await this.getSkillById(skillId);
            return skill !== null;
        } catch (error) {
            console.error(`Error validating skill ${skillId}:`, error);
            return false;
        }
    }

    /**
     * Get skills used by a specific profile
     */
    async getProfileSkills(profileId: string): Promise<Array<Skill & { proficiency: string }>> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare(`
                SELECT s.id, s.name, s.category, ps.proficiency
                FROM profile_skills ps
                JOIN skills s ON ps.skill_id = s.id
                WHERE ps.profile_id = ?
                ORDER BY s.name
            `);
            
            const rows = stmt.all(profileId) as Array<{
                id: string;
                name: string;
                category: string;
                proficiency: string;
            }>;
            
            return rows.map(row => ({
                id: row.id,
                name: row.name,
                category: row.category,
                proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
            }));
        } catch (error) {
            console.error(`Error getting skills for profile ${profileId}:`, error);
            throw error;
        }
    }

    // Private helper methods

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }
} 