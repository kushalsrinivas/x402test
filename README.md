# x402 Payment Protocol Demo - Crypto Paywall

A Next.js implementation of the x402 Payment Protocol for internet-native payments using cryptocurrency.

## 🚀 What is x402?

x402 is an open protocol for internet-native payments that leverages the HTTP 402 "Payment Required" status code. It enables:

- 💳 Direct crypto payments without credit cards or KYC
- ⚡ Gasless transactions using ERC-3009 TransferWithAuthorization
- 🔒 No accounts, sessions, or credential management
- 🌐 Perfect for pay-per-use content, APIs, and services

## 🎯 Features

- **Crypto Paywall**: Protect content behind a $0.10 USDC payment
- **Seamless UX**: Connect wallet → Sign message → Access content
- **Testnet Ready**: Built for Base Sepolia testnet
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **x402 Compliant**: Full implementation of x402 payment protocol

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js v22+ installed
- MetaMask or compatible Web3 wallet
- USDC on Avalanche Mainnet (get USDC from [Core Wallet](https://core.app/) or any exchange)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd x402test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   WALLET_ADDRESS=0xYourWalletAddressHere
   NODE_ENV=production
   PAYMENT_AMOUNT=$0.10
   PAYMENT_CURRENCY=USDC
   PAYMENT_NETWORK=avalanche-mainnet
   FACILITATOR_URL=https://x402.org/facilitator
   ```

   See [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

1. **Homepage**: Click "Pay $0.10 to Access Video"
2. **Authenticate**: Connect your MetaMask wallet
3. **Sign**: Approve the payment authorization (gasless!)
4. **Access**: Enjoy the premium video content

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── authenticate/route.ts       # x402 payment endpoint
│   │   ├── payment-info/route.ts       # Payment configuration
│   │   └── video-content/route.ts      # Protected content API
│   ├── authenticate/page.tsx           # Payment processing page
│   ├── video-content/page.tsx          # Protected content page
│   └── page.tsx                        # Homepage
├── components/
│   └── X402PaymentClient.tsx           # Client-side payment logic
└── lib/
    └── x402/
        ├── constants.ts                # Network configs, constants
        ├── middleware.ts               # x402 middleware
        ├── types.ts                    # TypeScript types
        ├── utils.ts                    # Helper functions
        ├── verify.ts                   # Payment verification
        └── index.ts                    # Main exports
```

## 🔑 Key Components

### x402 Middleware
Handles HTTP 402 responses and payment verification:
```typescript
import { x402Middleware } from '~/lib/x402';

const response = await x402Middleware(request, config);
```

### Payment Client
Client-side wallet connection and signing:
```tsx
import { X402PaymentClient } from '~/components/X402PaymentClient';

<X402PaymentClient 
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

## 🌐 Supported Networks

- **Avalanche Mainnet** (Default - Production)
  - Chain ID: 43114
  - USDC: 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E

- **Avalanche Fuji** (Testnet)
  - Chain ID: 43113
  - USDC: 0x5425890298aed601595a70AB815c96711a31Bc65

## 🔧 Configuration

Customize payment settings in your `.env`:

```env
# Change payment amount
PAYMENT_AMOUNT=$0.25

# Switch to testnet (for testing)
PAYMENT_NETWORK=avalanche-fuji

# Use custom facilitator
FACILITATOR_URL=https://your-facilitator.com
```

## 📚 How x402 Works

1. **Client requests protected resource**
   ```
   GET /api/authenticate
   ```

2. **Server responds with 402 Payment Required**
   ```json
   {
     "maxAmountRequired": "0.10",
     "payTo": "0xWalletAddress",
     "asset": "0xUSDCAddress",
     "network": "base-sepolia"
   }
   ```

3. **Client signs ERC-3009 authorization**
   - User signs a gasless payment authorization
   - No blockchain transaction required yet

4. **Client retries with X-PAYMENT header**
   ```
   X-PAYMENT: {"from":"0x...","to":"0x...","value":"100000",...}
   ```

5. **Server verifies and settles payment**
   - Facilitator verifies the signature
   - Settles payment on blockchain
   - Returns protected content

## 🚦 Testing

### Manual Testing
1. Get testnet USDC from [Avalanche Faucet](https://core.app/tools/testnet-faucet/)
2. Run `npm run dev`
3. Navigate to http://localhost:3000
4. Complete payment flow

### Check Payment Details
```bash
# View payment logs in console
npm run dev

# Watch for x402 payment events
# Check browser console for detailed logs
```

## 🐛 Troubleshooting

### Common Issues

**"MetaMask is not installed"**
- Install MetaMask extension
- Refresh the page

**"Insufficient payment amount"**
- Get USDC from an exchange or Core Wallet
- Ensure you have at least $0.10 USDC

**"Wrong network"**
- App will prompt you to switch to Avalanche Mainnet
- Approve the network switch in MetaMask

**"Payment verification failed"**
- Check wallet address in `.env`
- Verify facilitator URL is accessible
- Check browser console for errors

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables
Make sure to set these in your deployment platform:
- `WALLET_ADDRESS`
- `PAYMENT_AMOUNT`
- `PAYMENT_NETWORK`
- `FACILITATOR_URL`

## 📖 Learn More

- [x402 Protocol Documentation](https://www.x402.org/)
- [ERC-3009: Transfer With Authorization](https://eips.ethereum.org/EIPS/eip-3009)
- [Avalanche Network](https://www.avax.network/)
- [Circle USDC](https://www.circle.com/en/usdc)
- [Core Wallet](https://core.app/)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built following x402 protocol specification
- Uses x402.org facilitator service
- Powered by Avalanche network and Circle USDC

## 💬 Support

- [x402 Documentation](https://www.x402.org/)
- [Avalanche Discord](https://discord.gg/avax)
- [Core Wallet Support](https://support.avax.network/)

---

**⚡ Start building with x402 and enable internet-native payments!**
# x402test
