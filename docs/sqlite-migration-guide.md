# Migrating from JSON to SQLite: Step-by-Step Guide

This guide will help you transition your local JSON-based data storage to a robust SQLite database for your TalentDeck application.

---

## 1. **Why SQLite?**
- Handles large datasets efficiently
- Supports advanced queries and data integrity
- No server required—just a single file
- Easy to migrate to server-based SQL later

---

## 2. **Install SQLite and a Node.js Library**

**Recommended library:** [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (synchronous, fast, simple)

```bash
npm install better-sqlite3
```

Or, for async usage:
```bash
npm install sqlite3
```

---

## 3. **Design Your Database Schema**

Example schema for `profiles`:
```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  title TEXT,
  department TEXT,
  bio TEXT,
  image TEXT,
  hourlyRate REAL,
  dayRate REAL,
  yearlySalary REAL,
  createdAt TEXT,
  -- Add other fields as needed
);

CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  profileId TEXT,
  name TEXT,
  category TEXT,
  proficiency TEXT,
  FOREIGN KEY(profileId) REFERENCES profiles(id)
);

-- Add tables for education, certifications, etc.
```

---

## 4. **Migrate Existing Data**

1. **Write a migration script** to read your `profiles.json` and insert each profile into the SQLite database.
2. For each profile, insert into `profiles` and related tables (skills, education, etc.).

Example (Node.js):
```js
const Database = require('better-sqlite3');
const db = new Database('talentdeck.db');
const profiles = require('../data/profiles.json').profiles;

for (const profile of profiles) {
  db.prepare('INSERT INTO profiles (id, name, title, department, bio, image, hourlyRate, dayRate, yearlySalary, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(profile.id, profile.name, profile.title, profile.department, profile.bio, profile.image, profile.hourlyRate, profile.dayRate, profile.yearlySalary, profile.createdAt);
  // Insert skills, education, etc. as needed
}
```

---

## 5. **Update Your Data Access Layer**

- Replace file read/write logic with SQL queries.
- Example (using `better-sqlite3`):

```js
const db = new Database('talentdeck.db');

function getAllProfiles() {
  return db.prepare('SELECT * FROM profiles ORDER BY createdAt DESC').all();
}

function addProfile(profile) {
  db.prepare('INSERT INTO profiles (id, name, ...) VALUES (?, ?, ...)').run(profile.id, profile.name, ...);
}

function deleteProfile(id) {
  db.prepare('DELETE FROM profiles WHERE id = ?').run(id);
}
```

- Update your API routes to use these functions instead of file operations.

---

## 6. **Test the Integration**
- Run your app and verify all CRUD operations work as expected.
- Check that new profiles appear instantly and that deletes/updates are reflected in the UI.

---

## 7. **Advanced: Use an ORM (Optional)**
- For more complex apps, consider using an ORM like [Prisma](https://www.prisma.io/) or [Drizzle ORM](https://orm.drizzle.team/docs/overview) for type safety and migrations.

---

## 8. **Backup and Portability**
- SQLite databases are single files—easy to back up and move.
- For production, consider regular backups and migration strategies.

---

## 9. **Resources**
- [SQLite Documentation](https://sqlite.org/docs.html)
- [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3)
- [Prisma SQLite Docs](https://www.prisma.io/docs/concepts/database-connectors/sqlite)

---

**Questions?**
Feel free to ask for code samples or help with any step! 