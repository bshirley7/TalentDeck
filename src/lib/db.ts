/**
 * TalentDeck Database Connection Utility
 * Using Node.js v24+ native SQLite support
 * Note: Requires --experimental-sqlite flag to run
 */

import { DatabaseSync } from 'node:sqlite';
import { join } from 'path';

// Database interface for better type safety
interface DatabaseConnection {
    exec(sql: string): void;
    prepare(sql: string): PreparedStatement;
    close(): void;
    transaction<T>(callback: () => T): T;
}

interface PreparedStatement {
    run(...params: unknown[]): { changes: number; lastInsertRowid: number };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
}

// Simple database instance
let db: DatabaseSync | null = null;
let dbPath: string = '';

/**
 * Initialize SQLite database connection with proper schema
 */
export async function initializeDatabase(filePath?: string): Promise<DatabaseConnection> {
    if (db) {
        return createWrapper(db);
    }

    dbPath = filePath || join(process.cwd(), 'talentdeck.db');

    try {
        // Create SQLite database
        db = new DatabaseSync(dbPath);
        
        // Enable foreign key support
        db.exec('PRAGMA foreign_keys = ON');
        
        // Create tables if they don't exist
        const schema = `
            -- Profiles table
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                title TEXT NOT NULL,
                department TEXT NOT NULL,
                image TEXT,
                bio TEXT,
                hourlyRate REAL,
                dayRate REAL,
                yearlySalary REAL,
                createdAt TEXT NOT NULL
            );

            -- Contact information table
            CREATE TABLE IF NOT EXISTS contact_info (
                profile_id TEXT PRIMARY KEY,
                email TEXT,
                phone TEXT,
                website TEXT,
                location TEXT,
                linkedin TEXT,
                github TEXT,
                FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
            );

            -- Availability table
            CREATE TABLE IF NOT EXISTS availability (
                profile_id TEXT PRIMARY KEY,
                status TEXT NOT NULL DEFAULT 'Available',
                availableFrom TEXT,
                nextAvailable TEXT,
                preferredHours TEXT,
                timezone TEXT,
                bookingLeadTime TEXT,
                weeklyHours INTEGER,
                maxConcurrentProjects INTEGER,
                FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
            );

            -- Profile skills junction table
            CREATE TABLE IF NOT EXISTS profile_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id TEXT NOT NULL,
                skill_id TEXT NOT NULL,
                proficiency TEXT NOT NULL,
                FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
                FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
            );

            -- Skills table
            CREATE TABLE IF NOT EXISTS skills (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL
            );

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
            CREATE INDEX IF NOT EXISTS idx_profile_skills_profile_id ON profile_skills(profile_id);
        `;

        db.exec(schema);
        console.log(`✅ SQLite database connected: ${dbPath}`);
        console.log('📊 Database schema initialized');
        
        return createWrapper(db);
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw new Error('Could not initialize SQLite database: ' + error);
    }
}

/**
 * Create a wrapper for the native SQLite database to match our interface
 */
function createWrapper(database: DatabaseSync): DatabaseConnection {
    return {
        exec: (sql: string) => {
            database.exec(sql);
        },
        prepare: (sql: string) => {
            const stmt = database.prepare(sql);
            return {
                run: (...params: unknown[]) => {
                    return stmt.run(...params);
                },
                get: (...params: unknown[]) => {
                    return stmt.get(...params);
                },
                all: (...params: unknown[]) => {
                    return stmt.all(...params);
                }
            };
        },
        close: () => {
            database.close();
            console.log('🔌 Database connection closed');
        },
        transaction: <T>(callback: () => T): T => {
            database.exec('BEGIN TRANSACTION');
            try {
                const result = callback();
                database.exec('COMMIT');
                return result;
            } catch (error) {
                database.exec('ROLLBACK');
                throw error;
            }
        }
    };
}

/**
 * Get existing database connection
 * Must call initializeDatabase() first
 */
export function getDatabase(): DatabaseConnection {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return createWrapper(db);
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
    if (db) {
        try {
            db.close();
            db = null;
            console.log('🔌 Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error);
        }
    }
}

/**
 * For Electron: Initialize database in userData directory
 */
export async function initializeElectronDatabase(userDataPath: string): Promise<DatabaseConnection> {
    const dbPath = join(userDataPath, 'talentdeck.db');
    return initializeDatabase(dbPath);
}

/**
 * Health check - verify database is working
 */
export async function healthCheck(): Promise<boolean> {
    try {
        const database = getDatabase();
        const stmt = database.prepare('SELECT COUNT(*) as count FROM profiles');
        const result = stmt.get() as { count: number };
        return result.count >= 0;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
}

// Graceful shutdown
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);
process.on('exit', closeDatabase); 