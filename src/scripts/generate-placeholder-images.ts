import fs from 'fs';
import path from 'path';
import https from 'https';

const PROFILES_DIR = path.join(process.cwd(), 'public', 'images', 'profiles');

// Ensure the profiles directory exists
if (!fs.existsSync(PROFILES_DIR)) {
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

const profiles = [
  { name: 'sarah-chen', gender: 'female' },
  { name: 'marcus-rodriguez', gender: 'male' },
  { name: 'emma-thompson', gender: 'female' },
  { name: 'david-kim', gender: 'male' }
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve());
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

async function generatePlaceholderImages() {
  console.log('Generating placeholder profile images...');

  for (const profile of profiles) {
    const imageUrl = `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 1000)}`;
    const filepath = path.join(PROFILES_DIR, `${profile.name}.jpg`);

    try {
      await downloadImage(imageUrl, filepath);
      console.log(`✓ Generated placeholder for ${profile.name}`);
    } catch (error) {
      console.error(`✗ Failed to generate placeholder for ${profile.name}:`, error);
    }
  }

  console.log('Placeholder image generation complete!');
}

generatePlaceholderImages().catch(console.error); 