
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let nextProcess;

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
}

app.on('ready', () => {
  // Start the Next.js production server
  // Note: npm must be installed on the machine building/running this
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
