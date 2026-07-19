@echo off
echo Starting GarageFlow Desk Local Server...
echo.

:: Check for node
where node >nul 2>1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Install dependencies on first run
if not exist node_modules (
    echo [INFO] Installing system components (first-run only)...
    call npm install
)

:: Start the app
echo [INFO] Server launching on http://localhost:9002
echo.
start "" http://localhost:9002
npm run start