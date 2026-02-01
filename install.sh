#!/bin/bash
# METABOTPRIME vNext - Linux/macOS Installer

echo "🤖 METABOTPRIME vNext Installer"
echo "--------------------------------"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Run the setup wizard
node scripts/setup.js
