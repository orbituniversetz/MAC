# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses. 

## Features
- **Dashboard**: Real-time business metrics and profit tracking.
- **Job Sheets**: Professional A4 documentation with high-fidelity branding, customer complaints, and internal cost tracking.
- **Proformas**: High-fidelity quotations with automated VAT and discount handling.
- **Invoices**: One-click generation of official Tax Invoices from paid quotations.
- **A4 Document Engine**: Export professional A4 PDFs with high resolution and staple-friendly margins (20mm top margin on page 2+).
- **Auto-Updates**: Seamless version tracking via GitHub releases.
- **Offline First**: Uses a local SQLite database for speed and reliability without needing internet.

## Installation & Setup (Windows)

1. **Prerequisites**: 
   - Install [Node.js (LTS)](https://nodejs.org/).
2. **Setup**:
   - Open a terminal (PowerShell) in the project directory.
   - Run `npm install` to install required libraries.
3. **Build**:
   - Run `npm run dist`.
4. **Usage**:
   - Go to the `dist` folder.
   - Open `GarageFlow Desk.exe`. 
   - This is a **Portable Executable**; you can copy it to your Desktop or a USB stick and run it instantly.

## GitHub Auto-Updates

To enable the app to "fetch for updates" from your repository:

1. **Release Process**:
   - Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope.
   - Set it as an environment variable `GH_TOKEN` on your build machine.
   - Run `npm run dist`.
   - Go to the `dist` folder and upload the generated `.exe` and `latest.yml` to a new **GitHub Release** at `https://github.com/orbituniversetz/MAC`.
2. **Automatic Fetch**: 
   - The app will automatically check for newer versions on startup and prompt to install.

## Data & Backups
- The app uses a local SQLite database (`garage.db`) stored in your user folder: `%USERPROFILE%/.garageflow_desk/`.
- Use the **Backup Manager** tab within the app to export your data regularly.

## Development
To run in development mode:
```bash
npm run dev
```
Then open `http://localhost:9002` in your browser.
