@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"
start "" cmd /c ""%ROOT%Start.bat""
start "" "http://localhost:9002/loading.html"
