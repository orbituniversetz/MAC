@echo off
title GarageFlow Desk Launcher
echo Launching GarageFlow Desk Management System...
echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit
)
echo Starting local server...
start /min cmd /c "npm run dev"
echo Waiting for server to initialize...
timeout /t 5 /nobreak >nul
echo Opening GarageFlow Desk in your browser...
start http://localhost:9002
echo System is running. Minimize this window, do not close it.
pause