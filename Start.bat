
@echo off
TITLE GarageFlow Desk Launcher
echo Starting GarageFlow Desk Local Server...
echo Please do not close this window while using the app.
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit
)

:: Start the production server
start /b npm run start

echo Waiting for server to initialize...
timeout /t 5 /nobreak >nul

:: Open in default browser
start http://localhost:9002

echo.
echo Application is running at http://localhost:9002
echo You can now "Install" it as a PWA from your browser address bar.
