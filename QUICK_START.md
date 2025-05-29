# Quick Start: TalentDeck Database Integration

## Immediate Solution (Working Today)

### 1. Use Your Python Migration (Already Working! ✅)

Your Python script is the perfect solution for data migration:

```bash
# This already works and creates talentdeck.db
python scripts/migrate_to_sqlite.py

# Verify it worked
python -c "import sqlite3; conn = sqlite3.connect('talentdeck.db'); print('Profiles:', conn.execute('SELECT COUNT(*) FROM profiles').fetchone()[0]); conn.close()"
```

### 2. Simple Node.js Database Connection

Create this file to connect to your existing database:

```typescript
// src/lib/db.ts
import { join } from 'path';

let Database: any;
let db: any = null;

export async function connectDB(dbPath?: string) {
    if (db) return db;
    
    try {
        // Try to load better-sqlite3, fallback to error message
        const BetterSQLite3 = require('better-sqlite3');
        const path = dbPath || join(process.cwd(), 'talentdeck.db');
        db = new BetterSQLite3(path);
        console.log('Database connected:', path);
        return db;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw new Error('Database not available. Run: python scripts/migrate_to_sqlite.py');
    }
}

export function getDB() {
    if (!db) throw new Error('Database not connected. Call connectDB() first.');
    return db;
}
```

### 3. Update Your Services

Modify your existing services to use the simple connection:

```typescript
// src/services/skills.service.ts - UPDATE
import { getDB } from '../lib/db';

export class SkillsService {
    private get db() {
        return getDB();
    }
    
    // ... rest of your existing methods work unchanged
}
```

### 4. Initialize in Your App

```typescript
// In your main app file or layout
import { connectDB } from '@/lib/db';

// Initialize database on app start
async function initApp() {
    try {
        await connectDB();
        console.log('✅ Database ready');
    } catch (error) {
        console.error('❌ Database setup failed:', error);
    }
}

initApp();
```

## Alternative: Use sql.js (No Compilation Issues)

If better-sqlite3 keeps causing problems:

```bash
npm uninstall better-sqlite3 @types/better-sqlite3
npm install sql.js
```

```typescript
// src/lib/db-sql.ts
import initSqlJs from 'sql.js';
import { readFileSync } from 'fs';

let SQL: any;
let db: any;

export async function connectSqlJs(dbPath = './talentdeck.db') {
    if (db) return db;
    
    SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
    
    const filebuffer = readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
    
    return db;
}
```

## For Electron: Database Location

```typescript
// When building for Electron
import { app } from 'electron';
import { join } from 'path';

const dbPath = app.isPackaged 
    ? join(app.getPath('userData'), 'talentdeck.db')
    : join(process.cwd(), 'talentdeck.db');

await connectDB(dbPath);
```

## Verification Queries

Test your database with these queries:

```sql
-- Check tables exist
.tables

-- Count records
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM skills;
SELECT COUNT(*) FROM profile_skills;

-- Test joins
SELECT p.name, s.name as skill 
FROM profiles p 
JOIN profile_skills ps ON p.id = ps.profile_id 
JOIN skills s ON ps.skill_id = s.id 
LIMIT 5;
```

## Next Steps

1. **Today**: Use Python migration + simple Node.js connection
2. **This week**: Test with your React components
3. **Next week**: Add Electron-specific database handling
4. **Future**: Consider sql.js for zero-dependency solution

Your SQLite foundation is solid - this approach will get you running immediately! 