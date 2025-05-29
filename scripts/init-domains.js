const { DatabaseSync } = require('node:sqlite');

console.log('🔄 Initializing domains table...');

const db = new DatabaseSync('talentdeck.db');

// Create domains table
db.exec(`
  CREATE TABLE IF NOT EXISTS domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert default domains
const defaultDomains = [
  'Software Development',
  'Design', 
  'Product Management',
  'Marketing',
  'Sales',
  'Operations',
  'Consulting',
  'Content Creation',
  'Data Science',
  'Quality Assurance'
];

const stmt = db.prepare('INSERT OR IGNORE INTO domains (name) VALUES (?)');
let addedCount = 0;

for (const domain of defaultDomains) {
  const result = stmt.run(domain);
  if (result.changes > 0) {
    addedCount++;
  }
}

console.log(`✅ Added ${addedCount} new domains`);

// Show all domains
const allDomains = db.prepare('SELECT * FROM domains ORDER BY name').all();
console.log(`📊 Total domains in database: ${allDomains.length}`);
allDomains.forEach(domain => {
  console.log(`  - ${domain.name}`);
});

db.close();
console.log('🎉 Domains initialization complete!'); 