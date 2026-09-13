@echo off
setlocal EnableExtensions
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo Stopping GarageFlow Desk server and closing background processes...

rem Terminate processes by window title
taskkill /FI "WINDOWTITLE eq GarageFlow Desk Server*" /F /T >nul 2>&1

rem Terminate any process listening on port 9002
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr /r ":9002.*LISTENING"') do (
    echo Terminating process on port 9002 PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo GarageFlow Desk stopped successfully.
ping 127.0.0.1 -n 2 >nul
exit /b 0
