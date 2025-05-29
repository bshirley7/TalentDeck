# Profile Components Reorganization

## Current Structure
```
src/components/profiles/
├── forms/
│   ├── ProfileForm.tsx (from Profile/)
│   ├── ProfileCreationForm.tsx (from Profiles/)
│   └── form-steps/ (from Profiles/)
├── display/
│   ├── ProfileTable.tsx (from Profiles/)
│   └── ProfileSearch.tsx (from Profiles/)
└── sections/
    └── ProfileSkillsSection.tsx (from Profile/)
```

## Changes Made
1. Created new directory structure under `src/components/profiles/`
2. Moved form-related components to `forms/` directory
3. Moved display components to `display/` directory
4. Moved section components to `sections/` directory

## Next Steps
1. Update import paths in all moved files
2. Create index.ts files for each directory to export components
3. Update references in app pages
4. Remove old Profile/ and Profiles/ directories after confirming all imports are updated

## Component Responsibilities

### Forms Directory
- `ProfileForm.tsx`: Single-page form for editing existing profiles
- `ProfileCreationForm.tsx`: Multi-step form for creating new profiles
- `form-steps/`: Step components for the creation form

### Display Directory
- `ProfileTable.tsx`: Table display of profiles
- `ProfileSearch.tsx`: Search functionality for profiles

### Sections Directory
- `ProfileSkillsSection.tsx`: Component for managing skills in profiles 