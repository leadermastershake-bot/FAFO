@echo off
TITLE METABOTPRIME vNext Installer
echo 🤖 METABOTPRIME vNext Installer
echo --------------------------------

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the setup wizard
node scripts/setup.js

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Setup finished with some issues. Please check the messages above.
    pause
) else (
    echo.
    echo ✅ Setup completed successfully!
    pause
)
