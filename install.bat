@echo off
echo =============================================
echo    METABOTPRIME vNext All-in-One Installer
echo =============================================

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo pnpm could not be found. Falling back to npm...
    echo 1. Installing dependencies...
    call npm install
    echo 2. Running setup wizard...
    call npm run setup
) else (
    echo 1. Installing dependencies with pnpm...
    call pnpm install
    echo 2. Running setup wizard...
    call pnpm run setup
)

echo.
echo Done! You can now start the services using 'pnpm dev:backend' and 'pnpm dev:frontend'.
pause
