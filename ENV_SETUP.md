# Environment Configuration for x402 Payment Protocol

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Receiving wallet address (where payments will be sent)
# Replace with your actual wallet address
WALLET_ADDRESS=0xYourWalletAddressHere

# Environment
NODE_ENV=development

# Payment Configuration
PAYMENT_AMOUNT=$0.10
PAYMENT_CURRENCY=USDC
PAYMENT_NETWORK=base-sepolia

# Facilitator URL (optional, recommended)
# The facilitator handles payment verification and settlement
FACILITATOR_URL=https://x402.org/facilitator
```

## Setup Instructions

1. **Get a Wallet Address**
   - This is where you'll receive payments
   - Use any EVM-compatible wallet (MetaMask, etc.)
   - Copy your wallet address

2. **Get Test USDC on Base Sepolia**
   - Visit the Circle USDC Faucet: https://faucet.circle.com/
   - Request USDC for Base Sepolia testnet
   - You'll need at least $0.10 USDC to test the paywall

3. **Update .env File**
   - Copy `.env.example` to `.env`
   - Replace `0xYourWalletAddressHere` with your actual wallet address
   - Save the file

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Run the Development Server**

   ```bash
   npm run dev
   ```

6. **Test the Paywall**
   - Open http://localhost:3000
   - Click "Pay $0.10 to Access Video"
   - Connect your MetaMask wallet
   - Sign the payment authorization
   - Access the premium content!

## Network Configuration

### Base Sepolia (Testnet - Default)

- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- USDC Address: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

### Base Mainnet (Production)

- Chain ID: 8453
- RPC URL: https://mainnet.base.org
- USDC Address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

To switch to mainnet, update your `.env`:

```env
PAYMENT_NETWORK=base-mainnet
```

## Troubleshooting

### "MetaMask is not installed"

- Install MetaMask browser extension
- Refresh the page

### "Insufficient payment amount"

- Make sure you have at least $0.10 USDC on Base Sepolia
- Get free testnet USDC from Circle Faucet

### "Wrong network"

- The app will automatically prompt you to switch to Base Sepolia
- Approve the network switch in MetaMask

### "Payment verification failed"

- Check that your wallet address in .env is correct
- Ensure the facilitator URL is accessible
- Check browser console for detailed error messages

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production, use proper secret management
- Always use HTTPS in production

## Resources

- x402 Protocol: https://www.x402.org/
- Circle USDC Faucet: https://faucet.circle.com/
- Base Sepolia Explorer: https://sepolia.basescan.org/
- MetaMask: https://metamask.io/
