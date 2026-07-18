
@echo off
title GarageFlow Desk - Local Server
echo Starting GarageFlow Desk Offline Server...
echo.

:: Check for node_modules
if not exist "node_modules\" (
    echo Error: node_modules not found. Please run 'npm install' first.
    pause
    exit /b
)

:: Start the Next.js production server in the background
start /b npm run start

:: Wait for the server to initialize
echo Waiting for server to start on http://localhost:9002...
timeout /t 5 /nobreak > nul

:: Open the default browser to the app
start http://localhost:9002

echo.
echo Server is running. Close this window to stop the application.
pause
