import { NextRequest, NextResponse } from 'next/server';
import { DatabaseSync } from 'node:sqlite';

// Initialize database connection
function getDatabase() {
  return new DatabaseSync('talentdeck.db');
}

// Initialize domains table if it doesn't exist
function initializeDomains() {
  const db = getDatabase();
  
  // Create domains table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Insert default domains if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM domains').get() as { count: number };
  
  if (count.count === 0) {
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
    
    const stmt = db.prepare('INSERT INTO domains (name) VALUES (?)');
    for (const domain of defaultDomains) {
      stmt.run(domain);
    }
  }
  
  db.close();
}

export async function GET() {
  try {
    initializeDomains();
    const db = getDatabase();
    
    const domains = db.prepare('SELECT name FROM domains ORDER BY name').all() as { name: string }[];
    db.close();
    
    return NextResponse.json(domains.map(d => d.name));
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      );
    }
    
    const trimmedName = name.trim();
    
    initializeDomains();
    const db = getDatabase();
    
    try {
      // Insert new domain (will fail if duplicate due to UNIQUE constraint)
      const stmt = db.prepare('INSERT INTO domains (name) VALUES (?)');
      stmt.run(trimmedName);
      
      db.close();
      
      return NextResponse.json({ 
        message: 'Domain added successfully',
        name: trimmedName 
      });
    } catch (dbError: any) {
      db.close();
      
      if (dbError.message?.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'Domain already exists' },
          { status: 409 }
        );
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error adding domain:', error);
    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    );
  }
} 