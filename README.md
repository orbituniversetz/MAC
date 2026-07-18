# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses. 

## Features
- **Dashboard**: Real-time business metrics and profit tracking.
- **Job Sheets**: Document-centric repair lifecycle management with high-res A4 previews.
- **Proformas**: High-fidelity quotations with automated VAT and discount handling.
- **Invoices**: One-click generation of official Tax Invoices from paid quotations.
- **Expenses**: Link costs directly to jobs for accurate Net Profit (P&L) tracking.
- **A4 Document Engine**: Export professional A4 PDFs for Job Cards, Invoices, and Technical Reports with staple-friendly margins.

## GitHub Auto-Updates

To enable the app to "fetch for updates" from GitHub:

1. **GitHub Setup**: 
   - Ensure your code is hosted at `https://github.com/orbituniversetz/MAC`.
2. **Release Process**:
   - Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope.
   - Set it as an environment variable `GH_TOKEN` on your build machine.
   - Run `npm run dist`.
   - Go to the `dist` folder and upload the generated `.exe` and `latest.yml` to a new **GitHub Release**.
3. **Automatic Fetch**: 
   - The app is configured to automatically check your GitHub repository for newer versions on startup and prompt the user to install.

## Installation & Setup

1. **Prerequisites**: 
   - Install [Node.js (LTS)](https://nodejs.org/).
2. **Setup**:
   - Open a terminal in the project directory.
   - Run `npm install` to install required libraries.
3. **Build**:
   - Run `npm run dist`.
4. **Usage**:
   - Go to the `dist` folder.
   - Open `GarageFlow Desk.exe`. 
   - This is a **Portable Executable**; you can copy it to your Desktop or a USB stick and run it instantly.

## Data & Backups
- The app uses a local SQLite database (`garage.db`).
- Use the **Backup Manager** tab within the app to export your data regularly.

## Development
To run in development mode:
```bash
npm run dev
```
Then open `http://localhost:9002` in your browser.