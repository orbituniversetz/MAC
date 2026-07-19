
# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses.

## Features
- **Professional A4 Documents**: High-fidelity Job Sheets, Invoices, and Technical Reports.
- **Offline First**: Uses a local SQLite database for lightning-fast speed without internet.
- **PWA Ready**: Install as a standalone desktop app from your browser.
- **Auto-Updates**: Fetches the latest improvements from GitHub.

## Installation (Windows - Recommended)

1. **Install Node.js**: Download and install [Node.js 20 or 22 (LTS)](https://nodejs.org/).
2. **Setup Project**:
   - Download this project and extract it.
   - Open your terminal in the folder and run `npm install`.
3. **Launch the App**:
   - Double-click `Start.bat`. 
   - The app will open in your default browser at `http://localhost:9002`.
4. **Install to Desktop**:
   - Once open in Chrome or Edge, click the **Install** icon in the address bar.
   - You now have a standalone desktop app!

## Data Backups
Your data is stored safely in `local_data/garage.db`. Use the **Backup Manager** within the app to export `.sqlite` files regularly to a USB drive.

## GitHub Updates
This app is connected to `orbituniversetz/MAC`. When running as a compiled EXE, it will automatically check for updates. In web mode, simply pull the latest changes from GitHub and run `npm install`.
