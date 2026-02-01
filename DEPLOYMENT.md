# Deployment Instructions for METABOTPRIME vNext

This guide provides detailed instructions for setting up and deploying the METABOTPRIME vNext application.

## Local Development Setup

This setup is ideal for development and testing purposes.

### Prerequisites

*   **Node.js:** v18 or higher
*   **pnpm:** [Installation Guide](https://pnpm.io/installation)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/metabotprime-vnext.git
cd metabotprime-vnext
```

### 2. Run the Installer

The easiest way to set up the project is by using our interactive installer. This script will check your environment, install dependencies, and help you configure your environment variables.

```bash
# Linux / macOS
./install.sh

# Windows
install.bat
```

The wizard will prompt you for:
*   **Backend Port:** The port the backend server will listen on (default: 3001).
*   **RPC URL:** Your Ethereum node RPC URL (e.g., from Infura or Alchemy).
*   **Private Key:** The private key for the server-side wallet.
*   **Database URL:** The connection string for your MongoDB database.

### 4. Running the Application

The application consists of two main services: the `backend` and the `frontend`.

#### Running the Backend

The backend server is responsible for wallet management and blockchain interactions.

```bash
pnpm dev:backend
```

#### Running the Frontend

The frontend is a React application built with Vite.

```bash
pnpm dev:frontend
```

The frontend development server will typically start on `http://localhost:5173`.

### 5. Initial Configuration via the Frontend

Once both services are running, open your web browser and navigate to the frontend URL.

1.  You will be greeted by the **METABOTPRIME Setup** screen, as the backend is not yet fully configured.
2.  Enter your **RPC URL** for the desired Ethereum network (e.g., from Infura or Alchemy).
3.  Enter the **Private Key** for the server wallet you wish to use.
4.  Click **Save Configuration**. The application will update your `.env` file and reload the page.

Your application is now set up for local development.

## Production Deployment

This section will be updated with instructions for a production-ready deployment.

