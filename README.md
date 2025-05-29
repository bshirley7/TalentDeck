# TalentDeck

TalentDeck is an internal talent marketplace platform that helps organizations discover, manage, and connect their internal talent with projects. Built with modern web technologies, it provides a seamless experience for both talent and project managers.

## Features

- **Talent Discovery**: Find the right people for your projects with advanced search and matching algorithms
- **Skills Management**: Track and manage skills across your organization with a comprehensive skills directory
- **Project Matching**: Connect talent with projects based on skills, availability, and preferences
- **Profile Management**: Create and maintain detailed talent profiles with skills, experience, and availability information
- **Data Import/Export**: Import data from Airtable or CSV files, and export talent profiles to CSV format for backup or external use
- **CSV Export**: Export filtered or all talent profiles to CSV format with comprehensive data preservation

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/talentdeck.git
   cd talentdeck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
talentdeck/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── ui/          # Reusable UI components
│   ├── lib/             # Utility functions and shared logic
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── tests/              # Test files
```

## Development

- **Code Style**: Follows ESLint and Prettier configurations
- **Type Safety**: Strict TypeScript configuration
- **Component Structure**: Modular, reusable components with proper TypeScript types
- **State Management**: React hooks and context for state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/) and [ShadCN] (https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/icons/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

# TalentDeck Data Migration

This script migrates data from JSON files to a SQLite database for the TalentDeck application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Setup

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Ensure your data files are in the correct location:
   - `data/profiles.json`
   - `data/skills.json`
   - `data/categories.json`

## Running the Migration

1. Execute the migration script:
   ```bash
   python scripts/migrate_to_sqlite.py
   ```

The script will:
- Create a new SQLite database file (`talentdeck.db`)
- Create all necessary tables with proper schemas
- Migrate data from JSON files to the database
- Handle relationships between different entities
- Provide error handling and rollback capabilities

## Database Schema

The migration creates the following tables:
- `profiles`: Main profile information
- `contact_info`: Contact details for each profile
- `skills`: Available skills
- `profile_skills`: Junction table linking profiles to skills
- `availability`: Profile availability information
- `current_commitments`: Current project commitments
- `seasonal_availability`: Seasonal availability periods
- `education`: Education history
- `certifications`: Professional certifications

## Verification

You can verify the migrated data using the SQLite command line tool:
```bash
sqlite3 talentdeck.db
```

Example queries:
```sql
-- Count total profiles
SELECT COUNT(*) FROM profiles;

-- List all skills
SELECT * FROM skills;

-- Get profiles with their skills
SELECT p.name, s.name as skill, ps.proficiency
FROM profiles p
JOIN profile_skills ps ON p.id = ps.profile_id
JOIN skills s ON ps.skill_id = s.id;
```

## Error Handling

The migration script includes error handling and will:
- Roll back changes if an error occurs
- Provide detailed error messages
- Ensure database connection is properly closed

## Backup

It's recommended to back up your JSON files before running the migration:
```bash
cp data/*.json data/backup/
```
