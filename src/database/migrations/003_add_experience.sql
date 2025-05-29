-- Migration to add experience table
-- Created: 2024-03-20

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Begin transaction
BEGIN TRANSACTION;

-- Create experience table
CREATE TABLE experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_current BOOLEAN DEFAULT 0,
    description TEXT,
    skills_used TEXT,
    achievements TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX idx_experience_profile ON experience(profile_id);
CREATE INDEX idx_experience_company ON experience(company);
CREATE INDEX idx_experience_dates ON experience(start_date, end_date);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_experience_timestamp 
AFTER UPDATE ON experience
BEGIN
    UPDATE experience SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Commit transaction
COMMIT; 