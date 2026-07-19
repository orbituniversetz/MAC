@echo off
TITLE GarageFlow Desk - Local Server
echo --------------------------------------------------
echo   GARAGEFLOW DESK - STARTING LOCAL SERVER
echo --------------------------------------------------
echo.
echo [1/2] Checking if server is ready...
echo [2/2] Opening your browser to http://localhost:9002
echo.
echo * Keep this window open while using the app.
echo * You can close this window when you are finished.
echo.
echo --------------------------------------------------

:: Start the browser
start "" "http://localhost:9002"

:: Start the Next.js production server
npm run start

pause