# On Deck

On Deck is a modern internal talent marketplace platform that helps organizations discover, manage, and connect their internal talent with projects. Built with Next.js 15 and cutting-edge web technologies, it provides a seamless experience for both talent and project managers.

## 🚀 Features

### **Talent Discovery & Search**
- **Advanced Search**: Find talent by name, title, skills, department, and availability
- **Smart Filtering**: Filter by domains, skills (any/all matching), and availability status
- **Real-time Search**: Instant search results with intelligent matching algorithms
- **Skills-Based Discovery**: Comprehensive skills search across all database skills, not just profile-attached ones

### **Profile Management**
- **Comprehensive Profiles**: Detailed talent profiles with skills, experience, contact information, and availability
- **Multi-step Profile Creation**: Guided profile creation with basic info, skills, experience, and contact details
- **Profile Editing**: Easy-to-use profile editing with form validation
- **Skills Management**: Add, remove, and manage skills with proficiency levels
- **Availability Tracking**: Track current availability status and project commitments

### **Skills & Domain Management**
- **Dynamic Skills Database**: Centralized skills management with categories and proficiency levels
- **Domain Organization**: Comprehensive domain categorization (Engineering, Government, Healthcare, Finance, etc.)
- **API-Driven Dropdowns**: All dropdowns fetch from database APIs ensuring complete data availability
- **Expandable Categories**: Easy addition of new skills and domains through database

### **Data Management**
- **SQLite Database**: Robust data persistence with proper relational structure
- **Data Import/Export**: Import from Airtable/CSV and export to CSV with full data preservation
- **API Integration**: RESTful APIs for all data operations
- **Real-time Updates**: Instant updates across the application

### **User Experience**
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: Graceful error handling with user-friendly messages
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic HTML

## 🛠️ Tech Stack

### **Core Technologies**
- **Next.js 15**: React framework with App Router and Turbopack
- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Strict type safety throughout the application
- **SQLite**: Embedded database with Node.js native integration

### **Styling & UI**
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful hand-crafted SVG icons
- **CSS Modules**: Component-scoped styling where needed

### **Development & Testing**
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript Strict Mode**: Enhanced type checking

### **Database & APIs**
- **Node:sqlite**: Native SQLite integration (experimental)
- **RESTful APIs**: Clean API design with proper HTTP methods
- **Zod**: Runtime validation for API inputs/outputs
- **Error Boundaries**: React error handling

## 🏃‍♂️ Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/talentdeck.git
   cd talentdeck
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the database:**
   ```bash
   node scripts/init-database.js
   node scripts/init-domains.js
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
talentdeck/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API routes (skills, domains, profiles)
│   │   ├── profiles/          # Profile-related pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (Header, Footer, Navigation)
│   │   ├── profiles/         # Profile-related components
│   │   │   ├── create/       # Profile creation components
│   │   │   ├── display/      # Profile display components
│   │   │   └── edit/         # Profile editing components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utility functions and shared logic
│   │   ├── store.ts          # Data store and state management
│   │   └── utils.ts          # Helper utilities
│   ├── types/                # TypeScript type definitions
│   └── __tests__/            # Test files
├── data/                     # Static data files
├── scripts/                  # Database and utility scripts
├── public/                   # Static assets
└── talentdeck.db            # SQLite database file
```

## 🔧 Development

### **Code Quality**
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **API Design**: RESTful APIs with proper status codes and error handling
- **State Management**: React hooks and context for local state, database for persistence

### **Testing**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **Error Handling**: Comprehensive error boundary testing

### **Performance**
- **Next.js Optimizations**: SSR, SSG, and ISR where appropriate
- **Database Optimization**: Efficient queries and proper indexing
- **Loading States**: Skeleton loaders and loading indicators
- **Code Splitting**: Dynamic imports for optimal bundle size

## 🔄 API Endpoints

- `GET /api/profiles` - Fetch all profiles
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/[id]` - Update profile
- `DELETE /api/profiles/[id]` - Delete profile
- `GET /api/skills` - Fetch all skills
- `POST /api/skills` - Create new skill
- `GET /api/domains` - Fetch all domains
- `POST /api/domains` - Create new domain

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

### Environment Variables
```bash
# Add to .env.local
NODE_ENV=production
DATABASE_URL=./talentdeck.db
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style and TypeScript conventions
- Add unit tests for new components and features
- Update documentation for any API changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for the web
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Headless UI](https://headlessui.dev/)** - Unstyled, accessible UI components
- **[Heroicons](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[React Testing Library](https://testing-library.com/)** - Simple and complete testing utilities

---

Built with ❤️ for modern talent management
