import { runMigrations } from './run-migrations';
import { migrateProfiles } from './migrate-profiles';

async function migrate() {
    try {
        console.log('Starting database migration...');
        
        // Step 1: Run schema migrations
        console.log('\nStep 1: Running schema migrations');
        await runMigrations();
        
        // Step 2: Migrate profiles
        console.log('\nStep 2: Migrating profiles');
        await migrateProfiles();
        
        console.log('\nMigration completed successfully!');
    } catch (error) {
        console.error('\nMigration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrate(); 