/**
 * ProfileService - Database-backed profile management
 * Migrated from JSON file storage to SQLite database
 */

import { initializeDatabase, getDatabase } from '@/lib/db';
import type { TalentProfile, ProfileSkill, Education, Certification } from '@/types';

interface ImageObject {
    preview: string;
}

interface DatabaseError extends Error {
    code?: string;
    errno?: number;
}

interface ProfileRow {
    id: string;
    name: string;
    title: string;
    department: string;
    image?: string;
    bio?: string;
    hourlyRate?: number;
    dayRate?: number;
    yearlySalary?: number;
    createdAt: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    status?: string;
    availableFrom?: string;
    nextAvailable?: string;
    preferredHours?: string;
    timezone?: string;
    bookingLeadTime?: string;
    weeklyHours?: number;
    maxConcurrentProjects?: number;
    skills_json?: string;
}

interface DatabaseStatement {
    run: (...params: (string | number | null)[]) => { lastInsertRowid: number };
    all: () => ProfileRow[];
    get: () => ProfileRow | undefined;
}

interface Database {
    prepare: (sql: string) => DatabaseStatement;
    transaction: <T>(callback: () => T) => T;
}

interface ProfileSkill {
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ProjectCommitment {
    projectId: string;
    projectName: string;
    role: string;
    startDate: string;
    endDate: string;
    commitmentPercentage: number;
    notes?: string;
}

interface SeasonalAvailability {
    startDate: string;
    endDate: string;
    status: 'Available' | 'Limited' | 'Unavailable';
    notes?: string;
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

interface SkillRow {
    id: string;
    name: string;
    category: string;
    proficiency: string;
}

interface ProjectCommitmentRow {
    projectId: string;
    projectName: string;
    role: string;
    startDate: string;
    endDate: string;
    commitmentPercentage: number;
    notes: string | null;
}

interface SeasonalAvailabilityRow {
    startDate: string;
    endDate: string;
    status: string;
    notes: string | null;
}

interface EducationRow {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export class ProfileService {
    private static instance: ProfileService;
    private initialized = false;

    private constructor() {}

    static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    /**
     * Initialize database connection
     */
    async initialize(): Promise<void> {
        if (!this.initialized) {
            await initializeDatabase();
            this.initialized = true;
        }
    }

    /**
     * Get all profiles with their experience
     */
    async getAllProfiles(): Promise<TalentProfile[]> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase() as Database;
            const stmt = db.prepare(`
                SELECT 
                    p.*,
                    c.email, c.phone, c.website, c.location, c.linkedin, c.github,
                    a.status, a.availableFrom, a.nextAvailable, a.preferredHours, 
                    a.timezone, a.bookingLeadTime, a.weeklyHours, a.maxConcurrentProjects,
                    GROUP_CONCAT(
                        json_object(
                            'id', s.id,
                            'name', s.name,
                            'category', s.category,
                            'proficiency', ps.proficiency
                        )
                    ) as skills_json
                FROM profiles p
                LEFT JOIN contact_info c ON p.id = c.profile_id
                LEFT JOIN availability a ON p.id = a.profile_id
                LEFT JOIN profile_skills ps ON p.id = ps.profile_id
                LEFT JOIN skills s ON ps.skill_id = s.id
                GROUP BY p.id
            `);
            
            const rows = stmt.all();
            
            return rows.map(row => ({
                id: row.id,
                name: row.name,
                title: row.title || '',
                department: row.department || '',
                bio: row.bio || undefined,
                image: row.image || undefined,
                contact: {
                    email: row.email || '',
                    phone: row.phone || '',
                    website: row.website || undefined,
                    location: row.location || undefined,
                    social: {
                        linkedin: row.linkedin || undefined,
                        github: row.github || undefined
                    }
                },
                skills: row.skills_json ? JSON.parse(`[${row.skills_json}]`) as ProfileSkill[] : [],
                availability: {
                    status: (row.status || 'Available') as 'Available' | 'On Project' | 'On Leave' | 'Limited' | 'Unavailable',
                    availableFrom: row.availableFrom || undefined,
                    nextAvailable: row.nextAvailable || undefined,
                    preferredHours: row.preferredHours || undefined,
                    timezone: row.timezone || undefined,
                    bookingLeadTime: row.bookingLeadTime || undefined,
                    capacity: row.weeklyHours ? {
                        weeklyHours: row.weeklyHours,
                        maxConcurrentProjects: row.maxConcurrentProjects || 1,
                        preferredProjectDuration: {
                            min: 1,
                            max: 12
                        }
                    } : undefined
                },
                hourlyRate: row.hourlyRate || 0,
                dayRate: row.dayRate || 0,
                yearlySalary: row.yearlySalary || 0
            }));
        } catch (error: unknown) {
            const dbError = error as DatabaseError;
            console.error('Error fetching profiles:', dbError);
            throw new Error(`Failed to fetch profiles: ${dbError.message}`);
        }
    }

    /**
     * Get profile by ID
     */
    async getProfileById(id: string): Promise<TalentProfile | null> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase() as Database;
            const stmt = db.prepare(`
                SELECT 
                    p.*,
                    c.email, c.phone, c.website, c.location, c.linkedin, c.github,
                    a.status, a.availableFrom, a.nextAvailable, a.preferredHours, 
                    a.timezone, a.bookingLeadTime, a.weeklyHours, a.maxConcurrentProjects,
                    GROUP_CONCAT(
                        json_object(
                            'id', s.id,
                            'name', s.name,
                            'category', s.category,
                            'proficiency', ps.proficiency
                        )
                    ) as skills_json
                FROM profiles p
                LEFT JOIN contact_info c ON p.id = c.profile_id
                LEFT JOIN availability a ON p.id = a.profile_id
                LEFT JOIN profile_skills ps ON p.id = ps.profile_id
                LEFT JOIN skills s ON ps.skill_id = s.id
                WHERE p.id = ?
                GROUP BY p.id
            `);
            
            const row = stmt.get(id) as ProfileRow | undefined;
            
            if (!row) {
                return null;
            }
            
            return {
                id: row.id,
                name: row.name,
                title: row.title || '',
                department: row.department || '',
                bio: row.bio || undefined,
                image: row.image || undefined,
                contact: {
                    email: row.email || '',
                    phone: row.phone || '',
                    website: row.website || undefined,
                    location: row.location || undefined,
                    social: {
                        linkedin: row.linkedin || undefined,
                        github: row.github || undefined
                    }
                },
                skills: row.skills_json ? JSON.parse(`[${row.skills_json}]`) as ProfileSkill[] : [],
                availability: {
                    status: (row.status || 'Available') as 'Available' | 'On Project' | 'On Leave' | 'Limited' | 'Unavailable',
                    availableFrom: row.availableFrom || undefined,
                    nextAvailable: row.nextAvailable || undefined,
                    preferredHours: row.preferredHours || undefined,
                    timezone: row.timezone || undefined,
                    bookingLeadTime: row.bookingLeadTime || undefined,
                    capacity: row.weeklyHours ? {
                        weeklyHours: row.weeklyHours,
                        maxConcurrentProjects: row.maxConcurrentProjects || 1,
                        preferredProjectDuration: {
                            min: 1,
                            max: 12
                        }
                    } : undefined
                },
                hourlyRate: row.hourlyRate || 0,
                dayRate: row.dayRate || 0,
                yearlySalary: row.yearlySalary || 0
            };
        } catch (error) {
            console.error(`Error getting profile ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create new profile with experience
     */
    async createProfile(profileData: Omit<TalentProfile, 'id'>): Promise<TalentProfile> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase() as Database;
            const id = this.generateId();
            
            // Validate required fields
            if (!profileData.name || profileData.name.trim() === '') {
                throw new Error('Profile name is required');
            }
            
            // Start transaction
            const result = db.transaction(() => {
                // Insert profile
                const profileStmt = db.prepare(`
                    INSERT INTO profiles (id, name, title, department, image, bio, notes, hourlyRate, dayRate, yearlySalary, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                profileStmt.run(
                    id,
                    profileData.name,
                    profileData.title || '',
                    profileData.department || '',
                    profileData.image || null,
                    profileData.bio || null,
                    profileData.notes || null,
                    profileData.hourlyRate || 0,
                    profileData.dayRate || 0,
                    profileData.yearlySalary || 0,
                    new Date().toISOString()
                );
                
                // Insert contact info
                if (profileData.contact) {
                    const contactStmt = db.prepare(`
                        INSERT INTO contact_info (profile_id, email, phone, website, location, linkedin, github)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `);
                    
                    contactStmt.run(
                        id,
                        profileData.contact.email,
                        profileData.contact.phone,
                        profileData.contact.website || null,
                        profileData.contact.location || null,
                        profileData.contact.social?.linkedin || null,
                        profileData.contact.social?.github || null
                    );
                }
                
                // Insert availability
                if (profileData.availability) {
                    const availabilityStmt = db.prepare(`
                        INSERT INTO availability (
                            profile_id, status, availableFrom, nextAvailable, 
                            preferredHours, timezone, bookingLeadTime, 
                            weeklyHours, maxConcurrentProjects
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);
                    
                    availabilityStmt.run(
                        id,
                        profileData.availability.status,
                        profileData.availability.availableFrom || null,
                        profileData.availability.nextAvailable || null,
                        profileData.availability.preferredHours || null,
                        profileData.availability.timezone || null,
                        profileData.availability.bookingLeadTime || null,
                        profileData.availability.capacity?.weeklyHours || null,
                        profileData.availability.capacity?.maxConcurrentProjects || null
                    );
                }
                
                // Insert skills
                if (profileData.skills && profileData.skills.length > 0) {
                    const skillStmt = db.prepare(`
                        INSERT INTO profile_skills (profile_id, skill_id, proficiency)
                        VALUES (?, ?, ?)
                    `);
                    
                    for (const skill of profileData.skills) {
                        skillStmt.run(id, skill.id, skill.proficiency);
                    }
                }
                
                return id;
            });
            
            // Return the created profile
            const profile = await this.getProfileById(result);
            if (!profile) {
                throw new Error('Failed to retrieve created profile');
            }
            return profile;
        } catch (error: unknown) {
            const dbError = error as DatabaseError;
            console.error('Error creating profile:', dbError);
            throw new Error(`Failed to create profile: ${dbError.message}`);
        }
    }

    /**
     * Update existing profile
     */
    async updateProfile(id: string, profileData: Partial<TalentProfile>): Promise<TalentProfile> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase() as Database;
            
            // Start transaction
            const updatedProfile = await db.transaction(async () => {
                // Update profile
                if (profileData.name || profileData.title || profileData.department || profileData.image !== undefined || 
                    profileData.bio || profileData.notes || profileData.hourlyRate || profileData.dayRate || profileData.yearlySalary) {
                    
                    // Handle image - extract preview string if it's an object
                    let imageValue = null;
                    if (profileData.image) {
                        if (typeof profileData.image === 'string') {
                            imageValue = profileData.image;
                        } else if (profileData.image && typeof profileData.image === 'object' && 'preview' in (profileData.image as ImageObject)) {
                            imageValue = (profileData.image as ImageObject).preview;
                        }
                    }
                    
                    const profileStmt = db.prepare(`
                        UPDATE profiles 
                        SET name = COALESCE(?, name),
                            title = COALESCE(?, title),
                            department = COALESCE(?, department),
                            image = COALESCE(?, image),
                            bio = COALESCE(?, bio),
                            notes = COALESCE(?, notes),
                            hourlyRate = COALESCE(?, hourlyRate),
                            dayRate = COALESCE(?, dayRate),
                            yearlySalary = COALESCE(?, yearlySalary),
                            updatedAt = ?
                        WHERE id = ?
                    `);
                    
                    profileStmt.run(
                        profileData.name || null,
                        profileData.title || null,
                        profileData.department || null,
                        imageValue,
                        profileData.bio || null,
                        profileData.notes || null,
                        profileData.hourlyRate || null,
                        profileData.dayRate || null,
                        profileData.yearlySalary || null,
                        new Date().toISOString(),
                        id
                    );
                }
                
                // Update contact info
                if (profileData.contact) {
                    const contactStmt = db.prepare(`
                        UPDATE contact_info 
                        SET email = COALESCE(?, email),
                            phone = COALESCE(?, phone),
                            website = COALESCE(?, website),
                            location = COALESCE(?, location),
                            linkedin = COALESCE(?, linkedin),
                            github = COALESCE(?, github)
                        WHERE profile_id = ?
                    `);
                    
                    contactStmt.run(
                        profileData.contact.email || null,
                        profileData.contact.phone || null,
                        profileData.contact.website || null,
                        profileData.contact.location || null,
                        profileData.contact.social?.linkedin || null,
                        profileData.contact.social?.github || null,
                        id
                    );
                }
                
                // Update availability
                if (profileData.availability) {
                    const availabilityStmt = db.prepare(`
                        UPDATE availability 
                        SET status = COALESCE(?, status),
                            availableFrom = COALESCE(?, availableFrom),
                            nextAvailable = COALESCE(?, nextAvailable),
                            preferredHours = COALESCE(?, preferredHours),
                            timezone = COALESCE(?, timezone),
                            bookingLeadTime = COALESCE(?, bookingLeadTime),
                            weeklyHours = COALESCE(?, weeklyHours),
                            maxConcurrentProjects = COALESCE(?, maxConcurrentProjects)
                        WHERE profile_id = ?
                    `);
                    
                    availabilityStmt.run(
                        profileData.availability.status || null,
                        profileData.availability.availableFrom || null,
                        profileData.availability.nextAvailable || null,
                        profileData.availability.preferredHours || null,
                        profileData.availability.timezone || null,
                        profileData.availability.bookingLeadTime || null,
                        profileData.availability.capacity?.weeklyHours || null,
                        profileData.availability.capacity?.maxConcurrentProjects || null,
                        id
                    );
                }
                
                // Update skills
                if (profileData.skills) {
                    // First delete existing skills
                    const deleteSkillsStmt = db.prepare('DELETE FROM profile_skills WHERE profile_id = ?');
                    deleteSkillsStmt.run(id);
                    
                    // Then insert new skills
                    const insertSkillsStmt = db.prepare(`
                        INSERT INTO profile_skills (profile_id, skill_id, proficiency)
                        VALUES (?, ?, ?)
                    `);
                    
                    for (const skill of profileData.skills) {
                        insertSkillsStmt.run(id, skill.id, skill.proficiency);
                    }
                }
                
                const profile = await this.getProfileById(id);
                if (!profile) {
                    throw new Error(`Profile ${id} not found after update`);
                }
                return profile;
            });
            
            return updatedProfile;
        } catch (error: unknown) {
            const dbError = error as DatabaseError;
            console.error(`Error updating profile ${id}:`, dbError);
            throw new Error(`Failed to update profile: ${dbError.message}`);
        }
    }

    /**
     * Delete profile
     */
    async deleteProfile(id: string): Promise<boolean> {
        await this.ensureInitialized();
        
        try {
            const db = getDatabase();
            const stmt = db.prepare('DELETE FROM profiles WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error(`Error deleting profile ${id}:`, error);
            throw error;
        }
    }

    // Helper methods

    private async getProfileSkills(profileId: string): Promise<ProfileSkill[]> {
        const db = getDatabase() as Database;
        const stmt = db.prepare(`
            SELECT s.id, s.name, s.category, ps.proficiency
            FROM profile_skills ps
            JOIN skills s ON ps.skill_id = s.id
            WHERE ps.profile_id = ?
        `);
        const results = stmt.all() as unknown as SkillRow[];
        return results.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            proficiency: row.proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
        }));
    }

    private async getCurrentCommitments(): Promise<ProjectCommitment[]> {
        try {
            const db = getDatabase() as Database;
            const stmt = db.prepare(`
                SELECT projectId, projectName, role, startDate, endDate, commitmentPercentage, notes
                FROM current_commitments
            `);
            const results = stmt.all() as unknown as ProjectCommitmentRow[];
            return results.map(row => ({
                projectId: row.projectId,
                projectName: row.projectName,
                role: row.role,
                startDate: row.startDate,
                endDate: row.endDate,
                commitmentPercentage: row.commitmentPercentage,
                notes: row.notes || undefined
            }));
        } catch {
            return [];
        }
    }

    private async getSeasonalAvailability(): Promise<SeasonalAvailability[]> {
        try {
            const db = getDatabase() as Database;
            const stmt = db.prepare(`
                SELECT startDate, endDate, status, notes
                FROM seasonal_availability
            `);
            const results = stmt.all() as unknown as SeasonalAvailabilityRow[];
            return results.map(row => ({
                startDate: row.startDate,
                endDate: row.endDate,
                status: row.status as 'Available' | 'Limited' | 'Unavailable',
                notes: row.notes || undefined
            }));
        } catch {
            return [];
        }
    }

    private async getEducation(): Promise<Education[]> {
        try {
            const db = getDatabase() as Database;
            const stmt = db.prepare(`
                SELECT institution, degree, field, startDate, endDate
                FROM education
            `);
            const results = stmt.all() as unknown as EducationRow[];
            return results.map(row => ({
                institution: row.institution,
                degree: row.degree,
                field: row.field,
                startDate: row.startDate,
                endDate: row.endDate
            }));
        } catch {
            return [];
        }
    }

    private async getCertifications(profileId: string): Promise<Array<{ name: string; issuer: string; date: string }>> {
        try {
            const db = getDatabase();
            const stmt = db.prepare(`
                SELECT name, issuer, date
                FROM certifications
                WHERE profile_id = ?
            `);
            const results = stmt.all(profileId) as Array<{ name: string; issuer: string; date: string }>;
            return results;
        } catch (error) {
            // Table doesn't exist yet, return empty array
            console.debug(`certifications table not found, returning empty array for profile ${profileId}`);
            return [];
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }
} 