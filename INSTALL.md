# Installation Guide - METABOTPRIME vNext

Welcome to the future of AI trading. Follow these steps to get your environment ready.

## 🚀 Quick Start (Recommended)

The easiest way to install METABOTPRIME vNext is using our automated installer.

### Linux / macOS
```bash
./install.sh
```

### Windows
Double-click `install.bat` or run:
```cmd
install.bat
```

## 🛠️ Manual Installation

If you prefer to set up manually, follow these steps:

1. **Install Dependencies**
   Standardize on `pnpm` (highly recommended):
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   Run the setup wizard:
   ```bash
   pnpm setup
   ```
   Alternatively, copy `.env.example` to `packages/backend/.env` and fill in your values.

3. **Start the Application**
   ```bash
   # Terminal 1: Backend
   pnpm dev:backend

   # Terminal 2: Frontend
   pnpm dev:frontend
   ```

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v9.0.0 or higher (automated via `corepack enable`)
- **Web Browser**: Chrome, Firefox, or Brave (for wallet interaction)

## 🩺 Troubleshooting

If the installation fails:
1. Run `./install.sh` again; it includes diagnostic checks.
2. Ensure no other service is using ports **3001** or **5173**.
3. Check your internet connection for dependency downloads.
4. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed error resolutions.
