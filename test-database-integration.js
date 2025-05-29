/**
 * TalentDeck Database Integration Test
 * This script tests that the SQLite database is working properly
 * Run this once Node.js v20.x is installed
 */

async function testDatabaseIntegration() {
    console.log('🧪 Testing TalentDeck Database Integration\n');
    
    try {
        // Test 1: Database Connection
        console.log('1️⃣ Testing database connection...');
        const { initializeDatabase } = require('./src/lib/db');
        await initializeDatabase();
        console.log('✅ Database connection successful\n');

        // Test 2: ProfileService
        console.log('2️⃣ Testing ProfileService...');
        const { ProfileService } = require('./src/services/profiles.service');
        const profileService = ProfileService.getInstance();
        await profileService.initialize();
        
        const profiles = await profileService.getAllProfiles();
        console.log(`✅ Found ${profiles.length} profiles`);
        
        if (profiles.length > 0) {
            const firstProfile = profiles[0];
            console.log(`   📋 Sample profile: ${firstProfile.name} (${firstProfile.title})`);
            console.log(`   🎯 Skills: ${firstProfile.skills?.length || 0} skills`);
        }
        console.log('');

        // Test 3: SkillsService
        console.log('3️⃣ Testing SkillsService...');
        const { SkillsService } = require('./src/services/skills.service');
        const skillsService = SkillsService.getInstance();
        await skillsService.initialize();
        
        const skills = await skillsService.getAllSkills();
        console.log(`✅ Found ${skills.length} skills`);
        
        const categories = await skillsService.getSkillCategories();
        console.log(`✅ Found ${categories.length} categories:`);
        categories.slice(0, 3).forEach(cat => {
            console.log(`   • ${cat.name} (${cat.count} skills)`);
        });
        console.log('');

        // Test 4: Search functionality
        console.log('4️⃣ Testing search functionality...');
        const jsSkills = await skillsService.searchSkills('JavaScript');
        console.log(`✅ Found ${jsSkills.length} JavaScript-related skills`);
        console.log('');

        // Test 5: Profile-Skills relationship
        console.log('5️⃣ Testing profile-skills relationships...');
        if (profiles.length > 0) {
            const profileSkills = await skillsService.getProfileSkills(profiles[0].id);
            console.log(`✅ Profile ${profiles[0].name} has ${profileSkills.length} skills`);
        }
        console.log('');

        console.log('🎉 All tests passed! Database integration is working perfectly.');
        console.log('\n📈 Database Summary:');
        console.log(`   👥 Profiles: ${profiles.length}`);
        console.log(`   🎯 Skills: ${skills.length}`);
        console.log(`   📂 Categories: ${categories.length}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\n🔧 Troubleshooting:');
        
        if (error.message.includes('better-sqlite3')) {
            console.error('   • Install Node.js v20.x LTS for better-sqlite3 compatibility');
            console.error('   • Or install sql.js as fallback: npm install sql.js');
        }
        
        if (error.message.includes('Database not initialized')) {
            console.error('   • Make sure talentdeck.db exists (run: python scripts/migrate_to_sqlite.py)');
        }
        
        console.error('   • Check that all dependencies are installed: npm install');
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testDatabaseIntegration();
}

module.exports = { testDatabaseIntegration }; 