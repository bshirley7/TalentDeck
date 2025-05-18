# TalentDeck

TalentDeck is an internal talent marketplace platform that helps organizations discover, manage, and connect their internal talent with projects. Built with modern web technologies, it provides a seamless experience for both talent and project managers.

## Features

- **Talent Discovery**: Find the right people for your projects with advanced search and matching algorithms
- **Skills Management**: Track and manage skills across your organization with a comprehensive skills directory
- **Project Matching**: Connect talent with projects based on skills, availability, and preferences
- **Profile Management**: Create and maintain detailed talent profiles with skills, experience, and availability information
- **Import Tools**: Easily import data from Airtable or CSV files

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
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
