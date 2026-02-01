#!/bin/bash

echo "============================================="
echo "   METABOTPRIME vNext All-in-One Installer"
echo "============================================="

# Check for pnpm
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found. Falling back to npm..."
    echo "1. Installing dependencies..."
    npm install
    echo "2. Running setup wizard..."
    npm run setup
else
    echo "1. Installing dependencies with pnpm..."
    pnpm install
    echo "2. Running setup wizard..."
    pnpm run setup
fi

echo "Done! You can now start the services using 'pnpm dev:backend' and 'pnpm dev:frontend'."
