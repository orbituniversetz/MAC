@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"
start "" /min cmd /c ""%ROOT%Start.bat""
exit /b 0
