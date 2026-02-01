const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.resolve(__dirname, '../../.env');

// Ensure the directory for the .env file exists
const envDir = path.dirname(envPath);
if (!fs.existsSync(envDir)) {
  console.error(`❌ Error: Backend directory not found at ${envDir}`);
  process.exit(1);
}

async function askQuestion(query, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function runSetup() {
  console.log('\n=============================================');
  console.log('   METABOTPRIME vNext Configuration Wizard');
  console.log('=============================================\n');

  let currentEnv = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^"|"$/g, '');
        currentEnv[key] = value;
      }
    });
  }

  const port = await askQuestion('Server Port', currentEnv['PORT'] || '3001');
  const rpcUrl = await askQuestion('RPC URL', currentEnv['RPC_URL'] || '');
  const privateKey = await askQuestion('Server Wallet Private Key', currentEnv['PRIVATE_KEY'] || '');
  const dbUrl = await askQuestion('Database URL (MongoDB)', currentEnv['DATABASE_URL'] || 'mongodb://localhost:27017/metabotprime');

  const envContent = [
    `PORT=${port}`,
    `RPC_URL="${rpcUrl}"`,
    `PRIVATE_KEY="${privateKey}"`,
    `DATABASE_URL="${dbUrl}"`
  ].join('\n');

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ Configuration successfully saved to: ${envPath}`);
  } catch (error) {
    console.error(`\n❌ Failed to save configuration: ${error.message}`);
  }

  console.log('\nInstallation and configuration complete!');
  console.log('-----------------------------------------');
  console.log('To start the platform:');
  console.log('  pnpm dev:backend   (Start AI & Wallet Service)');
  console.log('  pnpm dev:frontend  (Start Dashboard)');
  console.log('\nHappy trading!\n');

  rl.close();
}

runSetup();
