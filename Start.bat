@echo off
setlocal EnableExtensions
set "ROOT=%~dp0"
cd /d "%ROOT%"
set "ICON=%ROOT%src\app\favicon.ico"
set "SHORTCUT=%USERPROFILE%\Desktop\GarageFlow Desk.lnk"
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
set "URL=http://localhost:9002"
set "LOADING_URL=%ROOT%public\loading.html"
set "DASHBOARD_URL=%URL%/dashboard"
set "NEXT_TELEMETRY_DISABLED=1"
set "CI=1"

if not exist "%NODE_EXE%" (
    echo Node.js was not found at C:\Program Files\nodejs\node.exe
    pause
    exit /b 1
)

if not exist "%NPM_CMD%" (
    echo npm was not found at C:\Program Files\nodejs\npm.cmd
    pause
    exit /b 1
)

echo Starting GarageFlow Desk...
echo Using Node.js: %NODE_EXE%
"%NODE_EXE%" -v >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo First run setup: Installing dependencies...
    call "%NPM_CMD%" install --no-audit --no-fund --prefer-offline
) else (
    if exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
        echo Native database module is already available.
    ) else (
        echo Rebuilding native database module for the current Node.js version...
        call "%NPM_CMD%" rebuild better-sqlite3 --silent
    )
)

if exist "%ICON%" (
    powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%ROOT%Start.bat'; $s.WorkingDirectory = '%ROOT%'; $s.IconLocation = '%ICON%,0'; $s.WindowStyle = 7; $s.Save()"
)

if not exist "%ROOT%local_data" mkdir "%ROOT%local_data" >nul 2>&1

echo Checking whether the app is already running on port 9002...
powershell -NoProfile -Command "$ErrorActionPreference='SilentlyContinue'; try { $r = Invoke-WebRequest -Uri '%DASHBOARD_URL%' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 (
    echo Existing server detected; opening browser to dashboard...
    start "" "%DASHBOARD_URL%"
    exit /b 0
)

echo Opening loading screen...
start "" "%LOADING_URL%"

echo Checking if server is already starting...
tasklist /FI "WINDOWTITLE eq GarageFlow Desk Server" 2>nul | findstr /i "cmd.exe" >nul 2>&1
if not errorlevel 1 (
    echo Server is already starting up in the background...
    goto :wait_server
)

echo Starting local server on port 9002...
start "GarageFlow Desk Server" /min cmd /c ""%NPM_CMD%" run dev > "%ROOT%local_data\dev.log" 2>&1"

:wait_server
echo Waiting for server to initialize...
for /l %%i in (1,1,60) do (
    powershell -NoProfile -Command "$ErrorActionPreference='SilentlyContinue'; try { $r = Invoke-WebRequest -Uri '%DASHBOARD_URL%' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 goto :ready
    ping 127.0.0.1 -n 2 >nul
)

echo Warning: Server did not respond within 60 seconds.
pause
exit /b 1

:ready
echo Server started successfully!
exit /b 0
