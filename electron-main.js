const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let nextProcess;

// Configure auto-updater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    title: "GarageFlow Desk",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:9002');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Check for updates once the window is ready
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

// Auto-updater events
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `A new version (${info.version}) of GarageFlow Desk is available. It is being downloaded in the background.`,
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: `Version ${info.version} has been downloaded. Restart the application now to apply the updates?`,
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err);
});

app.on('ready', () => {
  // Start the Next.js production server
  nextProcess = spawn('npm', ['run', 'start'], {
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Give the server a few seconds to start up before opening the window
  setTimeout(createWindow, 6000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (nextProcess) nextProcess.kill();
});