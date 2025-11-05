#!/usr/bin/env node

/**
 * Environment Configuration Check Script
 * Validates that all required environment variables are set correctly
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Checking x402 environment configuration...\n');

// Check if .env file exists
const envPath = join(rootDir, '.env');
if (!existsSync(envPath)) {
  console.error('❌ Error: .env file not found!');
  console.log('\n📝 To fix this:');
  console.log('   1. Copy .env.local.example to .env');
  console.log('   2. Update WALLET_ADDRESS with your wallet address');
  console.log('   3. Get test USDC from https://faucet.circle.com/\n');
  process.exit(1);
}

console.log('✓ .env file found');

// Parse .env file
const envContent = readFileSync(envPath, 'utf-8');
/** @type {Record<string, string>} */
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.+)$/);
  if (match && match[1] && match[2]) {
    envVars[match[1]] = match[2];
  }
});

// Required variables
const required = ['WALLET_ADDRESS', 'PAYMENT_AMOUNT', 'PAYMENT_NETWORK'];
let hasErrors = false;

console.log('\n📋 Required variables:');
required.forEach(key => {
  const value = envVars[key];
  if (!value || value.includes('YourWallet') || value.includes('0x0000')) {
    console.log(`   ❌ ${key}: Not configured`);
    hasErrors = true;
  } else {
    // Mask wallet address for security
    const displayValue = key === 'WALLET_ADDRESS' 
      ? `${value.slice(0, 6)}...${value.slice(-4)}`
      : value;
    console.log(`   ✓ ${key}: ${displayValue}`);
  }
});

// Optional variables
console.log('\n📋 Optional variables:');
const optional = ['FACILITATOR_URL', 'NODE_ENV'];
optional.forEach(key => {
  const value = envVars[key];
  if (value) {
    console.log(`   ✓ ${key}: ${value}`);
  } else {
    console.log(`   - ${key}: Using default`);
  }
});

// Validate wallet address format
const walletAddress = envVars['WALLET_ADDRESS'];
if (walletAddress && !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
  console.log('\n⚠️  Warning: WALLET_ADDRESS does not appear to be a valid Ethereum address');
  console.log('   Expected format: 0x followed by 40 hexadecimal characters');
  hasErrors = true;
}

// Network info
console.log('\n🌐 Network Configuration:');
const network = envVars['PAYMENT_NETWORK'] || 'base-sepolia';
if (network === 'base-sepolia') {
  console.log('   Network: Base Sepolia (Testnet)');
  console.log('   Chain ID: 84532');
  console.log('   USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e');
  console.log('   💡 Get free USDC: https://faucet.circle.com/');
} else if (network === 'base-mainnet') {
  console.log('   Network: Base Mainnet (Production)');
  console.log('   Chain ID: 8453');
  console.log('   USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
  console.log('   ⚠️  You are using MAINNET - real money will be involved!');
} else {
  console.log('   ⚠️  Unknown network:', network);
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration has errors. Please fix them before running.');
  console.log('\n📚 See ENV_SETUP.md for detailed setup instructions.\n');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm run dev');
  console.log('   2. Open http://localhost:3000');
  console.log('   3. Test the payment flow\n');
}

