import { Database } from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function runMigrations() {
    const db = new Database('talentdeck.db');
    
    try {
        // Enable foreign key support
        db.prepare('PRAGMA foreign_keys = ON').run();
        
        // Get list of migration files
        const migrationsDir = join(process.cwd(), 'src', 'database', 'migrations');
        const migrationFiles = [
            '001_initial_schema.sql',
            '002_populate_skills.sql'
        ];

        // Run each migration in sequence
        for (const migrationFile of migrationFiles) {
            console.log(`Running migration: ${migrationFile}`);
            const migrationPath = join(migrationsDir, migrationFile);
            const migrationSql = readFileSync(migrationPath, 'utf-8');
            
            // Split SQL into individual statements
            const statements = migrationSql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            
            // Create transaction function
            const runMigration = db.transaction(() => {
                for (const statement of statements) {
                    db.prepare(statement).run();
                }
            });
            
            // Execute transaction
            runMigration();
            console.log(`Completed migration: ${migrationFile}`);
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    } finally {
        db.close();
    }
}

// Run migrations
runMigrations().catch(console.error); 