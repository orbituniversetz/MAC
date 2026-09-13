const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let nextProcess;
const serverUrl = 'http://127.0.0.1:9002';
const appIcon = path.join(__dirname, 'src', 'app', 'favicon.ico');

// Gives Windows a stable application identity so the taskbar and Desktop
// shortcut consistently display the GarageFlow logo.
app.setAppUserModelId('com.garageflow.desk');

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Configure auto-updater
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 850,
      title: "GarageFlow Desk",
      icon: appIcon,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    mainWindow.loadURL(serverUrl);

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    // Check for updates once the window is ready
    mainWindow.once('ready-to-show', () => {
      try {
        autoUpdater.checkForUpdatesAndNotify();
      } catch (e) {
        console.error('Update check failed:', e);
      }
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

  function serverIsReady() {
    return new Promise((resolve) => {
      const request = http.get(`${serverUrl}/dashboard`, (response) => {
        response.resume();
        resolve(response.statusCode >= 200 && response.statusCode < 500);
      });
      request.setTimeout(1000, () => { request.destroy(); resolve(false); });
      request.on('error', () => resolve(false));
    });
  }

  async function waitForServer() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await serverIsReady()) return true;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return false;
  }

  function stopServer() {
    if (!nextProcess || !nextProcess.pid) return;
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', String(nextProcess.pid)], { windowsHide: true, shell: true });
      } else {
        nextProcess.kill();
      }
    } catch (err) {
      console.error('Error stopping server:', err);
    }
    nextProcess = null;
  }

  app.on('ready', async () => {
    // Prevent a second GarageFlow process and reuse an already-running local server.
    if (!(await serverIsReady())) {
      const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const logDir = path.join(__dirname, 'local_data');
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      const logFile = path.join(logDir, 'server.log');
      const outStream = fs.openSync(logFile, 'a');

      nextProcess = spawn(npmCommand, ['run', 'start'], {
        cwd: __dirname,
        shell: process.platform === 'win32',
        windowsHide: true,
        stdio: ['ignore', outStream, outStream],
        env: { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
      });

      nextProcess.on('error', (err) => {
        console.error('Failed to spawn Next server process:', err);
      });
    }

    if (await waitForServer()) {
      createWindow();
    } else {
      dialog.showErrorBox('GarageFlow could not start', 'The local production server did not become available on port 9002. Please check local_data/server.log for details.');
    }
  });

  app.on('window-all-closed', () => {
    stopServer();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', stopServer);
}
