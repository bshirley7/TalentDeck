# Spectrum - Internal Talent Marketplace

Spectrum is an internal talent marketplace designed to replace the current Airtable-based solution. It provides a comprehensive platform for discovering and connecting with internal talent across a wide range of skills and expertise.

## Features

- **Talent Profiles**: Comprehensive profiles with detailed skill information
- **Search & Discovery**: Advanced search with multiple filters
- **Skills Directory**: Browse and explore available skills
- **Data Import**: Import data from Airtable or CSV files
- **Profile Management**: Create and edit talent profiles
- **Availability Tracking**: Track talent availability and scheduling

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/spectrum.git
   cd spectrum
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   # Add any environment variables here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
spectrum/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── profiles/       # Profile pages
│   │   ├── skills/         # Skills directory pages
│   │   └── import/         # Import functionality
│   ├── components/         # React components
│   ├── lib/               # Utility functions and data handling
│   └── types/             # TypeScript type definitions
├── data/                  # JSON data storage
├── public/               # Static assets
└── tests/               # Test files
```

## Data Structure

The application uses a JSON-based data structure stored in the `data` directory:

```typescript
interface TalentProfile {
  id: string;
  name: string;
  department: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    social: {
      linkedin?: string;
      twitter?: string;
      // ... other social profiles
    };
  };
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  availability: {
    status: 'Available' | 'Busy' | 'Away';
    availableFrom?: string;
    notes?: string;
  };
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Adding New Features

1. Create new components in `src/components`
2. Add new pages in `src/app`
3. Add new API routes in `src/app/api`
4. Update types in `src/types`
5. Add tests in `tests` directory

### Data Import

The application supports importing data from:
- Airtable exports (JSON)
- CSV files

See the import page for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js for the framework
- Tailwind CSS for styling
- Zod for validation
- React Hook Form for form handling
