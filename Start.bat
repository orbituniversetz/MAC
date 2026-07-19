@echo off
echo Starting GarageFlow Desk...
echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

if not exist node_modules (
    echo First run setup: Installing dependencies...
    call npm install
)

echo Starting local server on port 9002...
start /b npm run dev
echo Waiting for server to initialize...
timeout /t 6 /nobreak >nul
echo Opening GarageFlow Desk...
start http://localhost:9002
