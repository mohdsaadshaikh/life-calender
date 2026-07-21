const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    envVars[key] = value;
  }
});

const secretsToUpload = [
  'DATABASE_URL',
  'CLERK_SECRET_KEY',
  'CLERK_WEBHOOK_SIGNING_SECRET',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL'
];

console.log("Uploading secrets to Cloudflare Worker...");

for (const key of secretsToUpload) {
  const value = envVars[key];
  if (!value) {
    console.warn(`Warning: ${key} not found in .env`);
    continue;
  }

  console.log(`Uploading ${key}...`);
  try {
    // Pipe the secret value to wrangler secret put in a shell-safe way
    // Use an input option in execSync to pass the value on stdin, which is cross-platform safe
    execSync(`npx wrangler secret put ${key}`, {
      input: value,
      stdio: ['pipe', 'inherit', 'inherit']
    });
    console.log(`✓ ${key} uploaded successfully.`);
  } catch (error) {
    console.error(`✗ Failed to upload ${key}:`, error.message);
  }
}

console.log("All done!");
