-- Migration to add notes table
-- Created: 2024-03-20

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Begin transaction
BEGIN TRANSACTION;

-- Create notes table
CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX idx_notes_profile ON notes(profile_id);
CREATE INDEX idx_notes_category ON notes(category);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_notes_timestamp 
AFTER UPDATE ON notes
BEGIN
    UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Commit transaction
COMMIT; 