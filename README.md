# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses. 

## Features
- **Dashboard**: Real-time business metrics and profit tracking.
- **Job Sheets**: Complete repair lifecycle management.
- **Proformas**: High-fidelity quotations with automated VAT.
- **Invoices**: One-click generation of official Tax Invoices.
- **Expenses**: Link costs directly to jobs for accurate P&L.
- **Document Engine**: High-resolution A4 PDF export for all records.

## Windows Installation (.exe)

Follow these steps to package the app for your Windows computer:

1. **Prerequisites**: 
   - Install [Node.js (LTS)](https://nodejs.org/).
2. **Setup**:
   - Open a terminal (PowerShell or CMD) in this directory.
   - Run `npm install` to install required libraries.
3. **Build**:
   - Run `npm run dist`.
4. **Usage**:
   - Go to the `dist` folder.
   - Open `GarageFlow Desk.exe`. 
   - You can copy this `.exe` to your Desktop for quick access.

## Data & Backups
- The app uses a local SQLite database (`garage.db`).
- You can manage backups via the **Backup Manager** tab within the app to ensure your data is safe.

## Development
To run in development mode:
```bash
npm run dev
```
Then open `http://localhost:9002` in your browser.
