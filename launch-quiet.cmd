@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"
start "" /b cmd /c ""%ROOT%Start.bat""
