# Troubleshooting Log

This file will document any errors or issues encountered during the development of the TraderLLM React application that could not be resolved automatically.

## Known Issues

### Issue: `pnpm` command not found
- **Description**: Occurs when `pnpm` is not installed globally.
- **Resolution**: Run `corepack enable` in your terminal, or install pnpm manually with `npm install -g pnpm`.

### Issue: Port 3001 or 5173 already in use
- **Description**: The application cannot start because the required ports are taken by another process.
- **Resolution**: The setup wizard will warn you about this. You can kill the process using the port (e.g., `fuser -k 3001/tcp` on Linux) or change the port in `packages/backend/.env`.

### Issue: RPC Connection Failure
- **Description**: The setup wizard reports it could not connect to your Ethereum RPC URL.
- **Resolution**: Verify your RPC URL (e.g., from Infura/Alchemy) and ensure your internet connection is active. You can still proceed, but blockchain features may not work.

---

### Issue: `npm install` fails with `uv_cwd` error

- **Timestamp**: 2025-09-20 22:54:49
- **Command**: `npm install express` (inside the `/server` directory)
- **Error**: `Error: ENOENT: no such file or directory, uv_cwd`
- **Description**: This error occurred when trying to install the `express` package. It suggests that the Node.js process could not find its current working directory. This is likely an environment-specific issue related to the sandboxed file system.
- **Workaround**: The initial workaround of combining `cd` and `npm install` also failed due to environment instability. The final workaround was to bypass the `npm install` command entirely. I manually edited the `server/package.json` file to include `express` in the `dependencies` section.
- **Action Required**: The user will need to run `npm install` (or `yarn install`) in the `server` directory to install the dependencies (`express`, `cors`) before running the application.

---

### Issue: `mkdir` command fails consistently

- **Timestamp**: 2025-09-20 22:56:52
- **Command**: `mkdir client/public` and `mkdir -p client/public`
- **Error**: `mkdir: cannot create directory ‘client/public’: No such file or directory`
- **Description**: The `mkdir` command is unable to create new directories, even with the `-p` flag. This occurs despite the fact that the `client` directory demonstrably exists (as I was able to create `client/package.json`). This points to a fundamental instability in the sandbox environment's file system tools.
- **Workaround**: I will proceed by creating all necessary frontend files (`index.html`, `index.js`, `App.js`, etc.) in a flat structure directly inside the `client` directory.
- **Action Required**: When setting up the project locally, the user must create the standard `create-react-app` directory structure (`client/public` and `client/src`) and move the files to their correct locations. The paths in `client/index.html` and `client/index.js` may need to be updated accordingly.

---

### Client-Side Dependencies

- **Note**: Due to the `npm install` issues, all client-side dependencies have been added manually to `client/package.json`.
- **Action Required**: The user will need to run `npm install` (or `yarn install`) in the `client` directory to install all dependencies, including `react`, `react-dom`, `ethers`, etc., before running the application.
