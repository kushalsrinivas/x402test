# x402 Quick Reference Card

## 🎯 Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run typecheck        # Check TypeScript
npm run lint             # Run linter
npm run lint:fix         # Auto-fix issues

# Setup
node scripts/check-env.js  # Validate environment
```

## 📝 Environment Variables

```env
WALLET_ADDRESS=0x...              # Required: Your receiving wallet
PAYMENT_AMOUNT=$0.10              # Required: Price to charge
PAYMENT_NETWORK=base-sepolia      # Required: Network (testnet/mainnet)
FACILITATOR_URL=https://x402.org/facilitator  # Optional: Facilitator
NODE_ENV=development              # Optional: Environment
```

## 🌐 Networks

| Network | Chain ID | USDC Address |
|---------|----------|--------------|
| Base Sepolia | 84532 | `0x036CbD5...3dCF7e` |
| Base Mainnet | 8453 | `0x833589...02913` |

## 📦 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── authenticate/      # x402 protected endpoint
│   │   ├── payment-info/      # Payment config
│   │   └── video-content/     # Protected content
│   ├── authenticate/          # Payment page
│   ├── video-content/         # Protected page
│   └── page.tsx              # Homepage
├── components/
│   └── X402PaymentClient.tsx  # Wallet integration
└── lib/x402/                  # Protocol implementation
    ├── constants.ts
    ├── middleware.ts
    ├── types.ts
    ├── utils.ts
    └── verify.ts
```

## 🔑 Key Concepts

### x402 Flow
1. Client requests protected resource
2. Server returns 402 + payment details
3. Client signs ERC-3009 authorization
4. Client retries with X-PAYMENT header
5. Server verifies with facilitator
6. Server grants access

### ERC-3009
- Gasless USDC transfers
- User signs typed message (EIP-712)
- No blockchain transaction by user
- Facilitator settles on-chain

## 🛠️ Usage Examples

### Protect an API endpoint

```typescript
// src/app/api/my-endpoint/route.ts
import { x402Middleware } from '~/lib/x402';

export async function GET(request: NextRequest) {
  const payment = await x402Middleware(request, {
    walletAddress: process.env.WALLET_ADDRESS!,
    price: '$1.00',
    network: 'base-sepolia'
  });
  
  if (payment) return payment; // 402 response
  
  // Payment verified, return protected data
  return NextResponse.json({ data: 'secret' });
}
```

### Create payment button

```tsx
<Link href="/authenticate">
  Pay to Access
</Link>
```

## 🐛 Common Errors

| Error | Solution |
|-------|----------|
| MetaMask not installed | Install MetaMask extension |
| Wrong network | Click "Switch Network" prompt |
| Insufficient funds | Get USDC from faucet |
| Payment verification failed | Check wallet address in .env |

## 🔗 Quick Links

- **Get USDC**: https://faucet.circle.com/
- **x402 Docs**: https://www.x402.org/
- **Base Explorer**: https://sepolia.basescan.org/
- **MetaMask**: https://metamask.io/

## 📊 Payment Status Codes

| Code | Meaning |
|------|---------|
| 402 | Payment Required |
| 200 | Payment Accepted |
| 400 | Invalid Payment |
| 403 | Payment Rejected |

## 💡 Tips

- Use Chrome/Brave for best MetaMask support
- Test on Sepolia before mainnet
- Keep `.env` file secure
- Monitor browser console for errors
- Clear cache if wallet won't connect

## 🔒 Security Checklist

- [ ] Never commit `.env` file
- [ ] Always verify with facilitator
- [ ] Validate payment amounts
- [ ] Check time windows
- [ ] Use HTTPS in production
- [ ] Implement rate limiting

## 📚 Documentation

| File | Purpose |
|------|---------|
| GET_STARTED.md | Quick 3-step setup |
| QUICKSTART.md | 5-minute guide |
| README.md | Full documentation |
| ENV_SETUP.md | Environment config |
| IMPLEMENTATION_GUIDE.md | Technical deep dive |
| PROJECT_SUMMARY.md | Complete overview |

---

**Print this and keep it handy! 📋**

