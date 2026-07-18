# GarageFlow Desk

A professional, offline-first Garage Management System designed for automotive repair businesses. 

## Features
- **Dashboard**: Real-time business metrics and profit tracking.
- **Job Sheets**: Complete repair lifecycle management with high-res A4 previews.
- **Proformas**: High-fidelity quotations with automated VAT and discount handling.
- **Invoices**: One-click generation of official Tax Invoices from paid quotations.
- **Expenses**: Link costs directly to jobs for accurate Net Profit (P&L) tracking.
- **Document Engine**: Export A4 PDFs for Job Cards, Invoices, and Technical Reports with staple-friendly margins.

## GitHub Auto-Updates (Advanced)

To enable the app to "fetch for updates" from GitHub:

1. **GitHub Setup**: 
   - Upload your source code to a GitHub repository.
   - Edit `package.json` and replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual details.
2. **Build Token**:
   - Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope.
   - Set it as an environment variable `GH_TOKEN` on your build machine.
3. **Release**:
   - Run `npm run dist`.
   - Upload the generated `.exe` and `latest.yml` from the `dist` folder to a new **GitHub Release**.
4. **Automatic Fetch**: 
   - The app is configured in `electron-main.js` to automatically check GitHub for newer versions on startup and prompt the user to install.

## Moving from Mac to Windows

If you are moving this project from a Mac (or Firebase Studio) to a Windows PC:

1. **Export**: Download the project folder as a ZIP file.
2. **Transfer**: Copy the ZIP to your Windows machine (via USB or Cloud).
3. **Extract**: Unzip the folder on your Windows Desktop.
4. **Data**: If you have existing data, copy the `garage.db` file into the new folder.

## Windows Installation (.exe)

Follow these steps to package the app for your Windows computer:

1. **Prerequisites**: 
   - Install [Node.js (LTS)](https://nodejs.org/).
2. **Setup**:
   - Open a terminal (PowerShell or CMD) in the project directory.
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