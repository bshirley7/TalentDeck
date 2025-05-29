import { Database } from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProfileService } from '../services/profile.service';

interface SkillInput {
    id: string;
    proficiency: number;
}

export async function migrateProfiles() {
    // Initialize database
    const db = new Database('talentdeck.db');
    
    // Initialize services
    const profileService = new ProfileService(db);

    try {
        // Read profiles from JSON
        const profilesPath = join(process.cwd(), 'data', 'profiles.json');
        const profilesData = JSON.parse(readFileSync(profilesPath, 'utf-8'));
        
        // Begin transaction
        db.transaction(() => {
            for (const profile of profilesData.profiles) {
                // Insert profile
                db.prepare(`
                    INSERT INTO profiles (
                        id, name, title, department, bio, image,
                        hourly_rate, day_rate, yearly_salary
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    profile.id,
                    profile.name,
                    profile.title,
                    profile.department,
                    profile.bio,
                    profile.image,
                    profile.hourlyRate,
                    profile.dayRate,
                    profile.yearlySalary
                );

                // Insert contact info
                if (profile.contact) {
                    const contactResult = db.prepare(`
                        INSERT INTO contact_info (
                            profile_id, email, phone, website, location
                        ) VALUES (?, ?, ?, ?, ?)
                    `).run(
                        profile.id,
                        profile.contact.email,
                        profile.contact.phone,
                        profile.contact.website,
                        profile.contact.location
                    );

                    // Insert social media
                    if (profile.contact.social) {
                        for (const [platform, url] of Object.entries(profile.contact.social)) {
                            if (url) {
                                db.prepare(`
                                    INSERT INTO social_media (
                                        contact_id, platform, url
                                    ) VALUES (?, ?, ?)
                                `).run(contactResult.lastInsertRowid, platform, url);
                            }
                        }
                    }
                }

                // Insert availability
                if (profile.availability) {
                    const availabilityResult = db.prepare(`
                        INSERT INTO availability (
                            profile_id, status, available_from, next_available,
                            preferred_hours, timezone, booking_lead_time,
                            weekly_hours, max_concurrent_projects,
                            preferred_project_duration_min,
                            preferred_project_duration_max
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).run(
                        profile.id,
                        profile.availability.status,
                        profile.availability.availableFrom,
                        profile.availability.nextAvailable,
                        profile.availability.preferredHours,
                        profile.availability.timezone,
                        profile.availability.bookingLeadTime,
                        profile.availability.capacity?.weeklyHours,
                        profile.availability.capacity?.maxConcurrentProjects,
                        profile.availability.capacity?.preferredProjectDuration?.min,
                        profile.availability.capacity?.preferredProjectDuration?.max
                    );

                    // Insert current commitments
                    if (profile.availability.currentCommitments) {
                        for (const commitment of profile.availability.currentCommitments) {
                            db.prepare(`
                                INSERT INTO current_commitments (
                                    availability_id, project_id, project_name,
                                    role, start_date, end_date,
                                    commitment_percentage, notes
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            `).run(
                                availabilityResult.lastInsertRowid,
                                commitment.projectId,
                                commitment.projectName,
                                commitment.role,
                                commitment.startDate,
                                commitment.endDate,
                                commitment.commitmentPercentage,
                                commitment.notes
                            );
                        }
                    }

                    // Insert seasonal availability
                    if (profile.availability.seasonalAvailability) {
                        for (const seasonal of profile.availability.seasonalAvailability) {
                            db.prepare(`
                                INSERT INTO seasonal_availability (
                                    availability_id, start_date, end_date,
                                    status, notes
                                ) VALUES (?, ?, ?, ?, ?)
                            `).run(
                                availabilityResult.lastInsertRowid,
                                seasonal.startDate,
                                seasonal.endDate,
                                seasonal.status,
                                seasonal.notes
                            );
                        }
                    }
                }

                // Insert education
                if (profile.education) {
                    for (const edu of profile.education) {
                        db.prepare(`
                            INSERT INTO education (
                                profile_id, institution, degree,
                                field, start_date, end_date
                            ) VALUES (?, ?, ?, ?, ?, ?)
                        `).run(
                            profile.id,
                            edu.institution,
                            edu.degree,
                            edu.field,
                            edu.startDate,
                            edu.endDate
                        );
                    }
                }

                // Insert certifications
                if (profile.certifications) {
                    for (const cert of profile.certifications) {
                        db.prepare(`
                            INSERT INTO certifications (
                                profile_id, name, issuer, date
                            ) VALUES (?, ?, ?, ?)
                        `).run(
                            profile.id,
                            cert.name,
                            cert.issuer,
                            cert.date
                        );
                    }
                }

                // Map and insert skills
                if (profile.skills) {
                    const skillsToAdd = profile.skills.map((skill: SkillInput) => ({
                        skillId: skill.id,
                        proficiency: skill.proficiency.toString()
                    }));
                    
                    try {
                        profileService.addProfileSkills(profile.id, skillsToAdd);
                    } catch (error: unknown) {
                        if (error instanceof Error) {
                            console.warn(`Warning: Could not add skills for profile ${profile.id}:`, error.message);
                        } else {
                            console.warn(`Warning: Could not add skills for profile ${profile.id}: Unknown error`);
                        }
                    }
                }
            }
        })();

        console.log('Profile migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    } finally {
        db.close();
    }
}

// Run migration
migrateProfiles().catch(console.error); 