@echo off
title GarageFlow Desk - Offline Server
echo ========================================
echo   GARAGEFLOW DESK - WINDOWS LAUNCHER
echo ========================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js LTS from https://nodejs.org/
    pause
    exit /b
)

:: Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Installing system components (this may take a minute)...
    call npm install
)

:: Build if no build exists
if not exist ".next" (
    echo [INFO] Preparing application for first-time run...
    call npm run build
)

echo [SUCCESS] Starting GarageFlow local server...
start /min cmd /c "npm run start"

echo [INFO] Waiting for database connection...
timeout /t 5 /nobreak >nul

echo [INFO] Opening GarageFlow Desk in your browser...
start http://localhost:9002

echo.
echo ========================================
echo   SERVER IS RUNNING IN THE BACKGROUND
echo ========================================
echo.
echo To install as a desktop app:
echo 1. Look at your browser address bar.
echo 2. Click the 'Install' icon (monitor icon).
echo.
echo Keep this window open while using the app.
pause
