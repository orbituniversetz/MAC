@echo off
setlocal EnableExtensions
set "ROOT=%~dp0"
set "APP_DIR=%ROOT:~0,-1%"
cd /d "%ROOT%"
set "ICON=%ROOT%src\app\favicon.ico"
set "SHORTCUT=%USERPROFILE%\Desktop\GarageFlow Desk.lnk"
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
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

if not exist "%ROOT%.next-production" (
    echo Initial build: Building application...
    call "%NPM_CMD%" run build
)

if exist "%ICON%" (
    rem Use Windows' actual Desktop folder (including redirected OneDrive Desktops).
    powershell -NoProfile -Command "$ErrorActionPreference = 'Stop'; try { $desktop = [Environment]::GetFolderPath('Desktop'); $ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut((Join-Path $desktop 'GarageFlow Desk.lnk')); $s.TargetPath = (Join-Path $env:APP_DIR 'Start.bat'); $s.WorkingDirectory = $env:APP_DIR; $s.IconLocation = ((Join-Path $env:APP_DIR 'src\app\favicon.ico') + ',0'); $s.WindowStyle = 7; $s.Save() } catch { Write-Warning ('Desktop shortcut could not be created: ' + $_.Exception.Message) }"
)

if not exist "%ROOT%local_data" mkdir "%ROOT%local_data" >nul 2>&1

if not exist "%ROOT%node_modules\electron\dist\electron.exe" (
    echo Ensuring Electron binary is available...
    call "%NODE_EXE%" "%ROOT%node_modules\electron\install.js"
)

if not exist "%ROOT%node_modules\electron\dist\electron.exe" (
    echo Electron is not installed. Run npm install first.
    pause
    exit /b 1
)

rem Electron owns the hidden production server and closes it with the app.
start "" /b "%ROOT%node_modules\electron\dist\electron.exe" "%APP_DIR%"
exit /b 0
