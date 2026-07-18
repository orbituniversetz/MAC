# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses.

## Features
- **Professional A4 Documents**: High-fidelity Job Sheets, Invoices, and Technical Reports.
- **Staple-Friendly Margins**: Automatic 20mm top margin on multi-page exports.
- **Intelligent Page Breaks**: Prevents document sections from splitting across pages.
- **Offline First**: Uses a local SQLite database for lightning-fast speed without internet.
- **PWA Ready**: Install as a standalone desktop app from your browser.

## Installation & Setup (Web Offline)

1. **Install Node.js**: Download and install [Node.js (LTS)](https://nodejs.org/).
2. **Setup Project**:
   - Open your terminal (PowerShell/CMD) in the project folder.
   - Run `npm install` to install dependencies.
3. **Start the App**:
   - Run `npm run dev`.
   - Open `http://localhost:9002` in your browser (Chrome or Edge recommended).
4. **Install to Desktop**:
   - Once the page is open, look for the **Install** icon in the browser's address bar.
   - Click it to create a desktop shortcut. The app will now open in its own clean window.

## Building as a Windows EXE (Optional)

If you prefer a single `.exe` file:
1. Run `npm run dist`.
2. Find the executable in the `dist` folder.

## GitHub Auto-Updates (EXE only)

1. Create a GitHub Release at `https://github.com/orbituniversetz/MAC`.
2. Upload your `.exe` and `latest.yml`.
3. The installed app will automatically check for updates on startup.

## Data Backups
Your data is stored safely in `local_data/garage.db` (Web mode) or `%USERPROFILE%/.garageflow_desk/` (EXE mode). Use the **Backup Manager** within the app to export `.sqlite` files regularly.
