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

### 2. Install Dependencies

Install all necessary dependencies for the monorepo from the root directory.

```bash
pnpm install
```

### 3. Configure the Backend

Before running the application, you must configure your environment variables. We provide an interactive CLI tool for this.

```bash
pnpm setup
# OR
npm run setup
```

The wizard will guide you through setting up your `PORT`, `RPC_URL`, `PRIVATE_KEY`, and `DATABASE_URL`. It will automatically create the `.env` file in `packages/backend/`.

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

## Deployment Refinement Assessment

To enhance the ease and simplicity of setting up METABOTPRIME vNext, we recommend transitioning the initial configuration to a dedicated setup wizard. This aligns with the project's goal of a "TurboTax-like" guided experience.

### Proposed Solution: CLI Setup Wizard

A command-line interface (CLI) wizard would be the most effective solution for guiding users through the setup process. This would be a script that can be executed with a simple `pnpm` command (e.g., `pnpm setup`).

#### How It Would Work

The wizard would be an interactive script that:

1.  **Prompts for Core Configuration:** Asks the user for essential information, such as:
    *   RPC URL
    *   Server Wallet Private Key
    *   Database connection string (once MongoDB/Prisma is integrated)
2.  **Validates Input:** Performs basic validation to ensure the provided data is in the correct format (e.g., a valid URL, a private key with the `0x` prefix).
3.  **Generates Environment Files:** Automatically creates the `.env` file in the `packages/backend` directory with the provided credentials. This is more secure and less error-prone than requiring users to create the file manually.
4.  **Handles Database Setup:** In the future, the wizard could be extended to:
    *   Verify the database connection.
    *   Run initial Prisma migrations to set up the database schema (`npx prisma db push`).
5.  **Provides Feedback:** Informs the user of the successful setup and instructs them on the next steps (i.e., running the `dev` servers).

#### Benefits

*   **Simplicity:** Reduces the number of manual steps required for setup.
*   **Reduced Errors:** Minimizes the risk of typos or incorrect file placement.
*   **Enhanced Security:** Prevents sensitive keys from being stored in shell history.
*   **Scalability:** Can be easily extended to accommodate new configuration options as the project grows.
