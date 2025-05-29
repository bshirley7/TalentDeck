# Installing Node.js LTS v20.x for TalentDeck

## Why Switch to Node.js v20.x?
Your current Node.js v22.15.0 has compatibility issues with `better-sqlite3` due to V8 API changes. Node.js LTS v20.x provides better stability and native module compatibility.

## Manual Installation Steps

### 1. Download Node.js v20.19.2 (Current LTS)
- **64-bit Windows**: https://nodejs.org/dist/v20.19.2/node-v20.19.2-x64.msi
- **32-bit Windows**: https://nodejs.org/dist/v20.19.2/node-v20.19.2-x86.msi

### 2. Installation Process
1. Run the downloaded `.msi` installer
2. Follow the installation wizard
3. **Important**: This will replace your current Node.js v22.15.0
4. Restart your terminal/PowerShell

### 3. Verify Installation
```bash
node --version
# Should show: v20.19.2

npm --version
# Should show the npm version bundled with Node.js v20.x
```

### 4. Reinstall Dependencies
After switching Node.js versions, reinstall your project dependencies:

```bash
# Navigate to your project
cd G:\DEVELOPMENT\TalentDeck

# Clear node_modules and package-lock.json
rm -rf node_modules
rm package-lock.json

# Reinstall everything with Node.js v20.x
npm install
```

### 5. Test better-sqlite3 Installation
```bash
# This should now work without compilation errors
npm install better-sqlite3 @types/better-sqlite3
```

## Alternative: Use Chocolatey (Windows Package Manager)

If you have Chocolatey installed:
```bash
# Uninstall current Node.js
choco uninstall nodejs

# Install Node.js LTS
choco install nodejs-lts
```

## Alternative: Use Winget (Windows 11)

If you have Windows 11 with winget:
```bash
# Uninstall current Node.js
winget uninstall "Node.js"

# Install Node.js LTS
winget install OpenJS.NodeJS.LTS
```

## Next Steps After Installation

1. **Verify Node.js version**: `node --version` should show v20.19.2
2. **Reinstall dependencies**: `npm install` in your project
3. **Test database connection**: Run your migration script
4. **Continue with database integration**: Use your existing SQLite setup

This will give you a stable, long-term supported Node.js version that works perfectly with `better-sqlite3` and your TalentDeck Electron app! 