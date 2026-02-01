const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
  console.log('\x1b[36m%s\x1b[0m', '🤖 METABOTPRIME vNext Setup Wizard\n');

  // 1. Detect Environment
  console.log('\x1b[33m%s\x1b[0m', '--- Environment Detection ---');
  const nodeVersion = process.version;
  console.log(`Node.js Version: ${nodeVersion}`);
  if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: Node.js v18 or higher is required.');
    process.exit(1);
  }

  try {
    const pnpmVersion = execSync('pnpm -v').toString().trim();
    console.log(`pnpm Version: ${pnpmVersion}`);
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: pnpm is not installed. Please install it with: npm install -g pnpm');
    process.exit(1);
  }
  console.log('\x1b[32m%s\x1b[0m', '✅ Environment check passed.\n');

  // 2. Configure .env
  console.log('\x1b[33m%s\x1b[0m', '--- Configuration ---');
  const backendDir = path.resolve(__dirname, '../packages/backend');
  const envPath = path.join(backendDir, '.env');

  if (!fs.existsSync(backendDir)) {
      console.error('\x1b[31m%s\x1b[0m', `❌ Error: Backend directory not found at ${backendDir}`);
      process.exit(1);
  }

  let existingEnv = {};
  if (fs.existsSync(envPath)) {
    console.log('Found existing .env file. Loading current values...');
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
    if (!rpcUrl || rpcUrl.startsWith('http://') || rpcUrl.startsWith('https://') || rpcUrl.startsWith('ws://') || rpcUrl.startsWith('wss://')) {
      break;
    }
    console.error('\x1b[31m%s\x1b[0m', '❌ Invalid RPC URL. It must start with http://, https://, ws://, or wss://');
  }

  let privateKey = '';
  while (true) {
    privateKey = await question(`Server Wallet Private Key [${existingEnv.PRIVATE_KEY || ''}]: `) || existingEnv.PRIVATE_KEY || '';
    if (!privateKey || (privateKey.startsWith('0x') && privateKey.length === 66) || privateKey.length === 64) {
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

  fs.writeFileSync(envPath, envContent);
  console.log('\x1b[32m%s\x1b[0m', `\n✅ .env file successfully updated at ${envPath}`);

  console.log('\x1b[33m%s\x1b[0m', '\n--- Finalizing ---');
  console.log('Running pnpm install...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('\x1b[32m%s\x1b[0m', '\n✅ Setup complete! You can now start the services with:');
    console.log('   pnpm dev:backend');
    console.log('   pnpm dev:frontend');
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', '\n❌ Error during pnpm install. Please run it manually.');
  }

  rl.close();
}

run();
