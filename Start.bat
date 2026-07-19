@echo off
echo Starting GarageFlow Desk Local Server...
echo Please ensure Node.js is installed.
start /min cmd /c "npm run start"
timeout /t 5
start http://localhost:9002/dashboard
echo System Ready. Opening in browser...
exit