-- Migration to fix skills schema
-- Created: 2024-03-20

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Begin transaction
BEGIN TRANSACTION;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS profile_skills;
DROP TABLE IF EXISTS skills;

-- Create standardized skills table
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create standardized profile_skills junction table
CREATE TABLE profile_skills (
    profile_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    proficiency TEXT NOT NULL CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_profile_skills_profile ON profile_skills(profile_id);
CREATE INDEX idx_profile_skills_skill ON profile_skills(skill_id);

-- Create trigger for updated_at timestamp on skills
CREATE TRIGGER update_skills_timestamp 
AFTER UPDATE ON skills
BEGIN
    UPDATE skills SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger for updated_at timestamp on profile_skills
CREATE TRIGGER update_profile_skills_timestamp 
AFTER UPDATE ON profile_skills
BEGIN
    UPDATE profile_skills SET updated_at = CURRENT_TIMESTAMP 
    WHERE profile_id = NEW.profile_id AND skill_id = NEW.skill_id;
END;

-- Insert default skills
INSERT INTO skills (id, name, category) VALUES
    -- Software Development
    ('s1', 'JavaScript', 'Software Development'),
    ('s2', 'Python', 'Software Development'),
    ('s3', 'Java', 'Software Development'),
    ('s4', 'React', 'Software Development'),
    ('s5', 'Node.js', 'Software Development'),
    ('s6', 'TypeScript', 'Software Development'),
    ('s7', 'AWS', 'Software Development'),
    ('s8', 'Microservices', 'Software Development'),
    ('s9', 'CI/CD', 'Software Development'),
    ('s10', 'Test Automation', 'Software Development'),
    
    -- Project Management
    ('s11', 'Project Management', 'Project Management'),
    ('s12', 'Agile Methodology', 'Project Management'),
    ('s13', 'Scrum', 'Project Management'),
    ('s14', 'Risk Management', 'Project Management'),
    ('s15', 'Resource Allocation', 'Project Management'),
    
    -- Business & Finance
    ('s16', 'Business Strategy', 'Business & Finance'),
    ('s17', 'Financial Analysis', 'Business & Finance'),
    ('s18', 'Market Research', 'Business & Finance'),
    ('s19', 'Strategic Planning', 'Business & Finance'),
    ('s20', 'Business Development', 'Business & Finance'),
    
    -- General Professional Skills
    ('s21', 'Communication', 'General Professional Skills'),
    ('s22', 'Leadership', 'General Professional Skills'),
    ('s23', 'Team Management', 'General Professional Skills'),
    ('s24', 'Problem-Solving', 'General Professional Skills'),
    ('s25', 'Critical Thinking', 'General Professional Skills');

-- Commit transaction
COMMIT; 