
@echo off
title GarageFlow Desk - Local Server
echo.
echo ==========================================
echo    GarageFlow Desk - Local Web Server
echo ==========================================
echo.
echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit
)

echo [2/3] Starting Local Server on Port 9002...
echo.
echo NOTE: Do not close this window while using the app.
echo.

start "" "http://localhost:9002"
npm run dev

pause
