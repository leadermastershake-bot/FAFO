# Installation Guide: METABOTPRIME vNext

Welcome to the installation guide for METABOTPRIME vNext, the sentient market partner. This document provides step-by-step instructions to get the application running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** v18.0.0 or higher.
*   **Package Manager:** [pnpm](https://pnpm.io/installation) (Recommended) or **npm** (v7+).
*   **Database:** [MongoDB](https://www.mongodb.com/try/download/community) (Optional, system will fallback to in-memory if not available).

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/metabotprime-vnext.git
cd metabotprime-vnext
```

---

## Step 2: All-in-One Installation (Quick Start)

You can install all dependencies and run the configuration wizard with a single command from the root directory.

### Using Shell Script (Linux/macOS)
```bash
./install.sh
```

### Using Batch File (Windows)
```bash
install.bat
```

### Using pnpm
```bash
pnpm run init
```

### Using npm
```bash
npm run init
```

---

## Alternative: Manual Installation

If you prefer to run the steps separately:

### 1. Install Dependencies
```bash
pnpm install  # or npm install
```

### 2. Run the Setup Wizard
```bash
pnpm run setup    # or npm run setup
```

The wizard will prompt you for:
*   **Server Port:** (Default: 3001)
*   **RPC URL:** Your Ethereum node URL (e.g., Infura, Alchemy).
*   **Private Key:** The private key for your server-side wallet.
*   **Database URL:** Your MongoDB connection string (Optional).

Alternatively, you can manually create a `.env` file in `packages/backend/.env`:
```env
PORT=3001
RPC_URL="your_rpc_url"
PRIVATE_KEY="your_private_key"
DATABASE_URL="mongodb://localhost:27017/metabotprime"
```

---

## Step 4: Initialize the Database (Optional)

If you are using MongoDB, run the following to sync your schema:

### Using pnpm
```bash
pnpm --filter backend prisma db push
```

### Using npm
```bash
npm run prisma:push --workspace=backend
```

---

## Step 5: Start the Application

You need to run both the backend and frontend services simultaneously.

### 1. Start the Backend
Open a new terminal and run:
```bash
# Using pnpm
pnpm dev:backend

# Using npm
npm run dev:backend
```

### 2. Start the Frontend
Open another terminal and run:
```bash
# Using pnpm
pnpm dev:frontend

# Using npm
npm run dev:frontend
```

The application will be available at `http://localhost:5173`.

---

## Troubleshooting

### "PrismaClient is not defined"
If you encounter this error on the backend, you may need to regenerate the Prisma client:
```bash
cd packages/backend
npx prisma generate
```

### Port 5173 or 3001 is already in use
You can change the backend port in your `.env` file. For the frontend, Vite will usually pick the next available port (e.g., 5174).

### Wallet not connecting
Ensure your `RPC_URL` is correct and reachable. If you don't have one yet, you can use a public RPC for testing (e.g., Sepolia).
