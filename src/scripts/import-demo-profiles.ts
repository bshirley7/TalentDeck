import fs from 'fs';
import path from 'path';
import { DataStore } from '../lib/store';

async function importDemoProfiles() {
  console.log('Starting demo profile import...');

  try {
    // Read demo profiles
    const demoProfilesPath = path.join(process.cwd(), 'src', 'data', 'demo-profiles.json');
    const demoProfilesData = JSON.parse(fs.readFileSync(demoProfilesPath, 'utf-8'));

    // Initialize data store
    const dataStore = DataStore.getInstance();

    // Clear existing profiles
    dataStore.clearProfiles();

    // Import each profile
    for (const profile of demoProfilesData.profiles) {
      try {
        await dataStore.addProfile(profile);
        console.log(`✓ Imported profile: ${profile.name}`);
      } catch (error) {
        console.error(`✗ Failed to import profile ${profile.name}:`, error);
      }
    }

    console.log('Demo profile import complete!');
  } catch (error) {
    console.error('Failed to import demo profiles:', error);
    process.exit(1);
  }
}

importDemoProfiles().catch(console.error); 