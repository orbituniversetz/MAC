@echo off
echo Starting GarageFlow Desk Offline Server...
echo Please wait 10 seconds for initialization...
start /min npm run dev
timeout /t 10 /nobreak > nul
start http://localhost:9002
exit
