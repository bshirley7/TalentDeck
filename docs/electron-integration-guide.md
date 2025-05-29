# Electron Integration Guide: Packaging Your Next.js App as a Desktop Application

This guide will help you turn your TalentDeck (Next.js/React) app into a cross-platform desktop app using Electron.

---

## 1. **Why Electron?**
- Run your web app as a native desktop app (Windows, Mac, Linux)
- Access local files, databases (like SQLite), and system APIs
- Distribute as an installer (EXE, DMG, etc.)

---

## 2. **Install Electron and Tools**

```bash
npm install --save-dev electron electron-builder
```
Or use [Electron Forge](https://www.electronforge.io/) for a batteries-included setup.

---

## 3. **Project Structure**

Add an `electron/` folder at your project root:
```
/electron
  main.js         # Electron main process
  preload.js      # (optional) Preload script for secure IPC
```

---

## 4. **Create the Electron Main Process**

**electron/main.js:**
```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // for security
      contextIsolation: true, // for security
    },
  });

  // Load your Next.js app (in dev or prod)
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../out/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

---

## 5. **Update package.json Scripts**

Add:
```json
"main": "electron/main.js",
"scripts": {
  "dev": "next dev",
  "build": "next build && next export",
  "electron": "electron ."
}
```
- Use `next export` to generate a static version of your app in `/out` for production.
- In development, run both `next dev` and `npm run electron` in separate terminals.

---

## 6. **Accessing Local Data (e.g., SQLite)**
- Use Node.js modules (like `better-sqlite3`) in the Electron main process or via a secure preload script.
- Use Electron's IPC (inter-process communication) to safely expose database functions to your React/Next.js frontend.
- **Never enable `nodeIntegration: true` in production for security.**

---

## 7. **Packaging Your App**

Use [electron-builder](https://www.electron.build/) to create installers:
```bash
npx electron-builder
```
- Configure build options in `package.json` or `electron-builder.yml`.
- You'll get `.exe`, `.dmg`, or `.AppImage` files for distribution.

---

## 8. **Best Practices**
- Use `contextIsolation: true` and a `preload.js` script for secure communication.
- Store user data (e.g., SQLite DB) in Electron's `app.getPath('userData')` directory.
- Handle auto-updates and error reporting for production apps.

---

## 9. **Resources**
- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Forge](https://www.electronforge.io/)
- [Electron Builder](https://www.electron.build/)
- [Using SQLite with Electron](https://www.sqlitetutorial.net/sqlite-nodejs/)
- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)

---

**Questions?**
Feel free to ask for a starter repo, code samples, or help with any step! 