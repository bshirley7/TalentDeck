-- Initial Schema Migration
-- Created: 2024-03-19
-- Description: Creates the initial database schema for TalentDeck

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Categories Table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    department TEXT,
    bio TEXT,
    image TEXT,
    hourly_rate REAL,
    day_rate REAL,
    yearly_salary REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Contact Information Table
CREATE TABLE contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    website TEXT,
    location TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Social Media Table
CREATE TABLE social_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact_info(id) ON DELETE CASCADE
);

-- Skills Table
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Profile Skills Junction Table
CREATE TABLE profile_skills (
    profile_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    proficiency TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Availability Table
CREATE TABLE availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    status TEXT NOT NULL,
    available_from TEXT,
    next_available TEXT,
    preferred_hours TEXT,
    timezone TEXT,
    booking_lead_time INTEGER,
    weekly_hours INTEGER,
    max_concurrent_projects INTEGER,
    preferred_project_duration_min INTEGER,
    preferred_project_duration_max INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Current Commitments Table
CREATE TABLE current_commitments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    availability_id INTEGER NOT NULL,
    project_id TEXT,
    project_name TEXT,
    role TEXT,
    start_date TEXT,
    end_date TEXT,
    commitment_percentage INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

-- Seasonal Availability Table
CREATE TABLE seasonal_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    availability_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

-- Education Table
CREATE TABLE education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT,
    field TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Certifications Table
CREATE TABLE certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT,
    date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_department ON profiles(department);
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_profile_skills_profile ON profile_skills(profile_id);
CREATE INDEX idx_profile_skills_skill ON profile_skills(skill_id);
CREATE INDEX idx_availability_profile ON availability(profile_id);
CREATE INDEX idx_education_profile ON education(profile_id);
CREATE INDEX idx_certifications_profile ON certifications(profile_id);
CREATE INDEX idx_contact_info_profile ON contact_info(profile_id);
CREATE INDEX idx_social_media_contact ON social_media(contact_id);
CREATE INDEX idx_current_commitments_availability ON current_commitments(availability_id);
CREATE INDEX idx_seasonal_availability_availability ON seasonal_availability(availability_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_timestamp 
AFTER UPDATE ON profiles
BEGIN
    UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_skills_timestamp 
AFTER UPDATE ON skills
BEGIN
    UPDATE skills SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_contact_info_timestamp 
AFTER UPDATE ON contact_info
BEGIN
    UPDATE contact_info SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_social_media_timestamp 
AFTER UPDATE ON social_media
BEGIN
    UPDATE social_media SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_availability_timestamp 
AFTER UPDATE ON availability
BEGIN
    UPDATE availability SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_current_commitments_timestamp 
AFTER UPDATE ON current_commitments
BEGIN
    UPDATE current_commitments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_seasonal_availability_timestamp 
AFTER UPDATE ON seasonal_availability
BEGIN
    UPDATE seasonal_availability SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_education_timestamp 
AFTER UPDATE ON education
BEGIN
    UPDATE education SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_certifications_timestamp 
AFTER UPDATE ON certifications
BEGIN
    UPDATE certifications SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END; 