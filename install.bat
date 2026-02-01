@echo off
setlocal enabledelayedexpansion

echo =================================================
echo      METABOTPRIME vNext Installation Script
echo =================================================
echo.

REM --- 1. Prerequisite Checks ---
echo [1/5] Checking for prerequisites...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js (https://nodejs.org/) and try again.
    pause
    exit /b 1
)

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not installed or not in your PATH.
    echo Please install pnpm by running: npm install -g pnpm
    pause
    exit /b 1
)

echo      - Node.js found.
echo      - pnpm found.
echo.

REM --- 2. Install Dependencies ---
echo [2/5] Installing project dependencies with pnpm...
pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies. Please check for errors above.
    pause
    exit /b 1
)
echo      - Dependencies installed successfully.
echo.

REM --- 3. Configure Backend Environment ---
echo [3/5] Configuring backend environment (.env file)...

set ENV_FILE=packages\backend\.env
set ENV_EXAMPLE_FILE=packages\backend\.env.example
set TEMP_ENV_FILE=packages\backend\.env.tmp

if not exist "%ENV_FILE%" (
    echo      - .env file not found. Creating from example...
    copy "%ENV_EXAMPLE_FILE%" "%ENV_FILE%" > nul
)

if exist "%TEMP_ENV_FILE%" del "%TEMP_ENV_FILE%"

echo.
echo --- Backend Configuration Wizard ---
echo Please provide values for the following variables.
echo Press ENTER to keep the current value shown in [brackets].
echo ----------------------------------------------------
echo.

for /f "usebackq tokens=1,* delims==" %%a in ("%ENV_FILE%") do (
    set "KEY=%%a"
    set "VALUE=%%b"

    REM Skip comments
    echo !KEY! | findstr /r "^#" > nul
    if !errorlevel! neq 0 (
        set /p "USER_INPUT=!KEY! [!VALUE!]: "
        if "!USER_INPUT!"=="" (
            echo !KEY!=!VALUE!>>"%TEMP_ENV_FILE%"
        ) else (
            echo !KEY!=!USER_INPUT!>>"%TEMP_ENV_FILE%"
        )
    ) else (
        echo !KEY!=!VALUE!>>"%TEMP_ENV_FILE%"
    )
)

move /y "%TEMP_ENV_FILE%" "%ENV_FILE%" > nul
echo.
echo ----------------------------------------------------
echo      - Configuration saved to %ENV_FILE%
echo.

REM --- 4. Start Backend Server & Health Check ---
echo [4/5] Starting backend server...

set BACKEND_PORT=3001
for /f "usebackq tokens=1,* delims==" %%a in ("%ENV_FILE%") do (
    if "%%a"=="PORT" set "BACKEND_PORT=%%b"
)

start "METABOTPRIME Backend" cmd /c "pnpm --filter backend dev"

echo      - Waiting for backend to become available at http://localhost:%BACKEND_PORT%/health
:healthcheckloop
timeout /t 2 /nobreak > nul
curl --output nul --silent --head --fail http://localhost:%BACKEND_PORT%/health
if %errorlevel% neq 0 (
    echo        ... backend not ready yet, retrying in 2 seconds.
    goto healthcheckloop
)
echo      - Backend is running.
echo.

REM --- 5. Start Frontend Server ---
echo [5/5] Starting frontend server...
start "METABOTPRIME Frontend" cmd /c "pnpm --filter frontend dev"
echo.

echo =================================================
echo           --- Installation Complete ---
echo =================================================
echo.
echo The backend and frontend servers are starting up in separate windows.
echo.
echo You should be able to access the application soon at:
echo http://localhost:5173 (or the port specified by the Vite server)
echo.
pause
exit /b 0
