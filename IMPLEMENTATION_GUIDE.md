# x402 Payment Protocol Implementation Guide

This document provides a comprehensive overview of the x402 implementation in this Next.js application.

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Components](#core-components)
4. [Payment Flow](#payment-flow)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Configuration](#configuration)
8. [Customization Guide](#customization-guide)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The implementation follows the x402 protocol specification and consists of:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   Server    │────────▶│ Facilitator │
│  (Browser)  │         │  (Next.js)  │         │   (x402)    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │ 1. Request resource    │                        │
      │───────────────────────▶│                        │
      │                        │                        │
      │ 2. Return 402 + details│                        │
      │◀───────────────────────│                        │
      │                        │                        │
      │ 3. Sign payment (EIP-712)                       │
      │                        │                        │
      │ 4. Retry with X-PAYMENT│                        │
      │───────────────────────▶│                        │
      │                        │ 5. Verify signature    │
      │                        │───────────────────────▶│
      │                        │                        │
      │                        │ 6. Settlement confirmed│
      │                        │◀───────────────────────│
      │                        │                        │
      │ 7. Return protected content                     │
      │◀───────────────────────│                        │
      └────────────────────────┘                        │
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── authenticate/
│   │   │   └── route.ts              # x402 payment verification endpoint
│   │   ├── payment-info/
│   │   │   └── route.ts              # Returns payment configuration
│   │   └── video-content/
│   │       └── route.ts              # Protected content API
│   │
│   ├── authenticate/
│   │   └── page.tsx                  # Payment processing page
│   ├── video-content/
│   │   └── page.tsx                  # Protected content page
│   └── page.tsx                      # Homepage with paywall
│
├── components/
│   └── X402PaymentClient.tsx         # Client-side wallet & signing logic
│
└── lib/
    └── x402/
        ├── constants.ts              # Network configs, addresses
        ├── middleware.ts             # x402 payment middleware
        ├── types.ts                  # TypeScript type definitions
        ├── utils.ts                  # Helper functions
        ├── verify.ts                 # Payment verification logic
        └── index.ts                  # Main exports
```

---

## Core Components

### 1. x402 Middleware (`src/lib/x402/middleware.ts`)

The middleware handles the core x402 protocol logic:

- Checks for `X-PAYMENT` header in requests
- Returns 402 response with payment details if no payment
- Validates payment structure and amount
- Verifies payment with facilitator
- Allows request to proceed if payment is valid

```typescript
import { x402Middleware } from '~/lib/x402';

const response = await x402Middleware(request, {
  walletAddress: '0x...',
  price: '$0.10',
  network: 'base-sepolia',
  facilitatorUrl: 'https://x402.org/facilitator'
});
```

### 2. Payment Client (`src/components/X402PaymentClient.tsx`)

Handles client-side operations:

- Detects MetaMask/Web3 wallet
- Switches to correct network
- Constructs EIP-712 typed data for ERC-3009
- Signs payment authorization (gasless)
- Sends payment to server with `X-PAYMENT` header

### 3. Payment Verification (`src/lib/x402/verify.ts`)

Validates payments:

- Checks payload structure
- Verifies amount is sufficient
- Validates time window
- Communicates with facilitator for final verification

---

## Payment Flow

### Step-by-Step Process

#### 1. User Initiates Payment

User clicks "Pay $0.10 to Access Video" on homepage.

```tsx
// src/app/page.tsx
<Link href="/authenticate">
  Pay $0.10 to Access Video →
</Link>
```

#### 2. Authentication Page Loads

The authenticate page automatically starts the payment process.

```tsx
// src/app/authenticate/page.tsx
<X402PaymentClient
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  onStatusChange={handleStatusChange}
/>
```

#### 3. Client Requests Payment Info

Client fetches payment configuration:

```typescript
GET /api/payment-info

Response:
{
  "walletAddress": "0x...",
  "paymentAmount": "$0.10",
  "network": "base-sepolia",
  "networkConfig": {
    "chainId": 84532,
    "usdcAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  }
}
```

#### 4. Wallet Connection

```typescript
const provider = new BrowserProvider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = await provider.getSigner();
```

#### 5. EIP-712 Signature

User signs a structured message (ERC-3009 TransferWithAuthorization):

```typescript
const domain = {
  name: 'USD Coin',
  version: '2',
  verifyingContract: usdcAddress,
  chainId: 84532
};

const message = {
  from: userAddress,
  to: sellerAddress,
  value: 100000, // 0.10 USDC (6 decimals)
  validAfter: timestamp,
  validBefore: timestamp + 3600,
  nonce: randomBytes32
};

const signature = await signer.signTypedData(domain, types, message);
```

#### 6. Payment Submission

Client retries authenticate endpoint with payment:

```typescript
POST /api/authenticate
Headers:
  X-PAYMENT: {"from":"0x...","to":"0x...","value":"100000",...}
```

#### 7. Server Verification

Server validates and verifies payment:

```typescript
// Extract payment from headers
const payment = extractPaymentPayload(request);

// Validate structure
if (!validatePaymentPayload(payment)) {
  return error(400);
}

// Check amount
if (!isPaymentAmountSufficient(payment.value, required)) {
  return error(402);
}

// Verify with facilitator
const result = await verifyPaymentWithFacilitator(payment, facilitatorUrl);

if (!result.valid) {
  return error(402);
}

// Payment verified! Grant access
return redirect('/video-content');
```

#### 8. Content Delivery

User is redirected to protected content page.

---

## API Endpoints

### `GET /api/authenticate`

Protected endpoint that requires x402 payment.

**No Payment:**
```
Status: 402 Payment Required
Headers:
  WWW-Authenticate: x402 {"maxAmountRequired":"0.10",...}
Body: {"maxAmountRequired":"0.10","payTo":"0x...",...}
```

**Valid Payment:**
```
Status: 307 Temporary Redirect
Location: /video-content
```

### `GET /api/payment-info`

Returns payment configuration for client.

**Response:**
```json
{
  "walletAddress": "0x...",
  "paymentAmount": "$0.10",
  "network": "base-sepolia",
  "networkConfig": {
    "name": "Base Sepolia",
    "chainId": 84532,
    "rpcUrl": "https://sepolia.base.org",
    "usdcAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  },
  "facilitatorUrl": "https://x402.org/facilitator"
}
```

### `GET /api/video-content`

Returns protected content data.

**Response:**
```json
{
  "success": true,
  "message": "Payment verified! Access granted.",
  "content": {
    "videoUrl": "https://www.youtube.com/embed/...",
    "title": "Premium Video Content",
    "description": "You have successfully paid..."
  }
}
```

---

## Frontend Components

### Homepage (`src/app/page.tsx`)

- Explains x402 and payment process
- Shows requirements and instructions
- Links to authenticate page

### Authenticate Page (`src/app/authenticate/page.tsx`)

- Displays payment status
- Shows loading spinner
- Handles wallet connection
- Signs payment authorization
- Redirects to content on success

### Video Content Page (`src/app/video-content/page.tsx`)

- Displays protected content
- Shows payment confirmation
- Explains what happened
- Links back to homepage

---

## Configuration

### Environment Variables

```env
# Required
WALLET_ADDRESS=0xYourAddress          # Where payments are sent
PAYMENT_AMOUNT=$0.10                  # Amount to charge
PAYMENT_NETWORK=base-sepolia          # Blockchain network

# Optional
FACILITATOR_URL=https://x402.org/facilitator
NODE_ENV=development
```

### Network Configuration

Networks are defined in `src/lib/x402/constants.ts`:

```typescript
export const NETWORKS = {
  'base-sepolia': {
    chainId: 84532,
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    rpcUrl: 'https://sepolia.base.org'
  },
  'base-mainnet': {
    chainId: 8453,
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    rpcUrl: 'https://mainnet.base.org'
  }
};
```

---

## Customization Guide

### Change Payment Amount

Update `.env`:
```env
PAYMENT_AMOUNT=$0.25
```

### Add New Payment Tier

Create multiple authentication endpoints:

```typescript
// src/app/api/authenticate-premium/route.ts
const X402_CONFIG = {
  walletAddress: process.env.WALLET_ADDRESS,
  price: '$1.00', // Premium tier
  network: 'base-sepolia'
};
```

### Add More Networks

Update `src/lib/x402/constants.ts`:

```typescript
export const NETWORKS = {
  ...existing,
  'polygon-mainnet': {
    chainId: 137,
    usdcAddress: '0x...',
    rpcUrl: 'https://polygon-rpc.com'
  }
};
```

### Custom Protected Content

Create new protected pages:

```typescript
// src/app/api/premium-api/route.ts
export async function GET(request: NextRequest) {
  const paymentResponse = await x402Middleware(request, X402_CONFIG);
  if (paymentResponse) return paymentResponse;
  
  // Return your protected data
  return NextResponse.json({ data: 'premium content' });
}
```

### Customize UI

All pages use Tailwind CSS and can be easily customized:

```tsx
// Change colors
className="bg-purple-500" → className="bg-blue-500"

// Change gradient
from-[#2e026d] to-[#15162c] → from-slate-900 to-slate-800
```

---

## Security Considerations

### ✅ Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use environment variables in production

2. **Validate all inputs**
   - Payment amounts
   - Wallet addresses
   - Time windows

3. **Use HTTPS in production**
   - Required for secure wallet connections
   - Prevents man-in-the-middle attacks

4. **Verify with facilitator**
   - Don't trust client signatures alone
   - Always verify with trusted facilitator

5. **Rate limiting**
   - Consider adding rate limits to prevent abuse
   - Use services like Vercel Edge Config

### ⚠️ Known Limitations

1. **No persistent sessions**
   - Payment verification happens per request
   - Consider adding JWT tokens for multi-page access

2. **Client-side only wallet**
   - Requires browser extension
   - No server-side wallet support

3. **Single payment token**
   - Each payment is one-time use
   - For subscriptions, implement token refresh

---

## Troubleshooting

### Development Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Type errors:**
```bash
# Regenerate types
npm run typecheck
```

**Linter errors:**
```bash
# Auto-fix
npm run lint:fix
```

### Runtime Issues

**"Cannot read properties of undefined (ethereum)":**
- MetaMask not installed
- Try in different browser
- Install MetaMask extension

**"User rejected the request":**
- User declined in MetaMask
- Normal behavior, allow retry

**"Transaction reverted":**
- Insufficient USDC balance
- Wrong network
- Check wallet has correct token

**402 keeps returning:**
- Check facilitator is accessible
- Verify wallet address in .env
- Check browser console for errors

### Network Issues

**"Wrong network" error:**
- Click "Switch Network" in MetaMask
- Or manually switch to Base Sepolia

**RPC errors:**
- Network congestion
- Try again in a few moments
- Check Base network status

---

## Additional Resources

- **x402 Protocol**: https://www.x402.org/
- **ERC-3009 Spec**: https://eips.ethereum.org/EIPS/eip-3009
- **EIP-712 Spec**: https://eips.ethereum.org/EIPS/eip-712
- **Base Docs**: https://docs.base.org/
- **Circle USDC**: https://www.circle.com/en/usdc
- **Ethers.js Docs**: https://docs.ethers.org/

---

## Support

For issues or questions:

1. Check this guide and README.md
2. Review ENV_SETUP.md for configuration
3. Check browser console for errors
4. Visit x402.org for protocol docs
5. Open an issue on GitHub

---

**Built with ❤️ using x402 Payment Protocol**

