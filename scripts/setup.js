const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');
const net = require('net');
const http = require('http');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true); // Other errors might not mean the port is in use
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function checkRpcConnectivity(url) {
  if (!url) return true; // Skip if no URL provided
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    try {
      const req = lib.request(url, { method: 'POST', timeout: 5000 }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 500); // 4xx still means it reached a server
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      // Send a basic JSON-RPC body
      req.write(JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }));
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function run() {
  console.log('\x1b[36m%s\x1b[0m', '🤖 METABOTPRIME vNext - Professional Setup Wizard\n');

  // 1. Detect Environment
  console.log('\x1b[33m%s\x1b[0m', '--- Phase 1: Environment Detection ---');

  // OS Detection
  console.log(`Operating System: ${process.platform} (${process.arch})`);

  // Node.js Version
  const nodeVersion = process.version;
  console.log(`Node.js Version: ${nodeVersion}`);
  if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: Node.js v18 or higher is required.');
    console.log('Please update Node.js: https://nodejs.org/');
    process.exit(1);
  }

  // pnpm check
  let hasPnpm = false;
  try {
    const pnpmVersion = execSync('pnpm -v', { stdio: 'pipe' }).toString().trim();
    console.log(`pnpm Version: ${pnpmVersion}`);
    hasPnpm = true;
  } catch (e) {
    console.log('pnpm not found. Attempting to enable via corepack...');
    try {
      execSync('corepack enable', { stdio: 'inherit' });
      const pnpmVersion = execSync('pnpm -v', { stdio: 'pipe' }).toString().trim();
      console.log(`pnpm Version (via corepack): ${pnpmVersion}`);
      hasPnpm = true;
    } catch (e2) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️  Warning: pnpm is not installed and corepack failed.');
      console.log('We will try to use npm as a fallback, but pnpm is highly recommended.');
    }
  }
  console.log('\x1b[32m%s\x1b[0m', '✅ Environment check complete.\n');

  // 2. Port Checks
  console.log('\x1b[33m%s\x1b[0m', '--- Phase 2: Port Availability ---');
  const backendPort = 3001;
  const frontendPort = 5173;

  const backendPortOk = await isPortAvailable(backendPort);
  const frontendPortOk = await isPortAvailable(frontendPort);

  if (!backendPortOk) console.warn('\x1b[33m%s\x1b[0m', `⚠️  Warning: Port ${backendPort} (Backend) appears to be in use.`);
  if (!frontendPortOk) console.warn('\x1b[33m%s\x1b[0m', `⚠️  Warning: Port ${frontendPort} (Frontend) appears to be in use.`);

  if (backendPortOk && frontendPortOk) {
    console.log('\x1b[32m%s\x1b[0m', '✅ Required ports are available.');
  }
  console.log();

  // 3. Configure .env
  console.log('\x1b[33m%s\x1b[0m', '--- Phase 3: Configuration (.env) ---');
  const backendDir = path.resolve(__dirname, '../packages/backend');
  const envPath = path.join(backendDir, '.env');

  if (!fs.existsSync(backendDir)) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error: Backend directory not found at ${backendDir}`);
    process.exit(1);
  }

  let existingEnv = {};
  if (fs.existsSync(envPath)) {
    console.log('Found existing configuration. Press Enter to keep current values.');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        existingEnv[key] = value;
      }
    });
  }

  const port = await question(`Backend Port [${existingEnv.PORT || '3001'}]: `) || existingEnv.PORT || '3001';

  let rpcUrl = '';
  while (true) {
    rpcUrl = await question(`Ethereum RPC URL [${existingEnv.RPC_URL || ''}]: `) || existingEnv.RPC_URL || '';
    if (!rpcUrl) break;
    if (rpcUrl.startsWith('http://') || rpcUrl.startsWith('https://') || rpcUrl.startsWith('ws://') || rpcUrl.startsWith('wss://')) {
      console.log('Testing RPC connectivity...');
      const ok = await checkRpcConnectivity(rpcUrl);
      if (ok) {
        console.log('\x1b[32m%s\x1b[0m', '✅ RPC connection successful.');
        break;
      } else {
        const confirm = await question('\x1b[33m⚠️  Could not connect to RPC. Use anyway? (y/n): \x1b[0m');
        if (confirm.toLowerCase() === 'y') break;
      }
    } else {
      console.error('\x1b[31m%s\x1b[0m', '❌ Invalid RPC URL. It must start with http://, https://, ws://, or wss://');
    }
  }

  let privateKey = '';
  while (true) {
    privateKey = await question(`Server Wallet Private Key [${existingEnv.PRIVATE_KEY || ''}]: `) || existingEnv.PRIVATE_KEY || '';
    if (!privateKey) break;
    if ((privateKey.startsWith('0x') && privateKey.length === 66) || privateKey.length === 64) {
      if (privateKey.length === 64 && !privateKey.startsWith('0x')) {
          privateKey = '0x' + privateKey;
      }
      break;
    }
    console.error('\x1b[31m%s\x1b[0m', '❌ Invalid Private Key. It should be 64 or 66 characters long.');
  }

  const databaseUrl = await question(`Database URL (MongoDB) [${existingEnv.DATABASE_URL || ''}]: `) || existingEnv.DATABASE_URL || '';

  const envContent = `PORT=${port}
RPC_URL="${rpcUrl}"
PRIVATE_KEY="${privateKey}"
DATABASE_URL="${databaseUrl}"
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\x1b[32m%s\x1b[0m', `\n✅ .env file successfully updated at ${envPath}`);
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Failed to write .env file: ${e.message}`);
  }

  // 4. Installation
  console.log('\x1b[33m%s\x1b[0m', '\n--- Phase 4: Dependency Installation ---');
  const installCmd = hasPnpm ? 'pnpm install' : 'npm install';
  console.log(`Running ${installCmd}... (this may take a minute)`);

  try {
    execSync(installCmd, { stdio: 'inherit' });
    console.log('\x1b[32m%s\x1b[0m', `\n✅ Installation complete!`);
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', `\n❌ Error during installation: ${e.message}`);
    console.log('Try running the install command manually.');
  }

  console.log('\x1b[36m%s\x1b[0m', '\n--- Setup Summary ---');
  console.log('You can now start the application:');
  console.log(`   ${hasPnpm ? 'pnpm' : 'npm run'} dev:backend  - Starts the Node.js server`);
  console.log(`   ${hasPnpm ? 'pnpm' : 'npm run'} dev:frontend - Starts the React application`);
  console.log('\nHappy Trading! 🚀');

  rl.close();
}

run();
