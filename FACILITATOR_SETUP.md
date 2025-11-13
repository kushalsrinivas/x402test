# 0xGasless Facilitator Setup Guide

## 🚀 Using 0xGasless x402 Facilitator

This project is now configured to use the **[0xGasless x402 Facilitator](https://x402.0xgasless.com/)** service for Avalanche C-Chain payments.

### What is 0xGasless?

[0xGasless](https://x402.0xgasless.com/) is a plug-and-play x402 payment facilitator specifically built for Avalanche Chain. It provides:

- ✅ **No Setup Required** - Just use their endpoint, no API keys needed
- ✅ **Fast Settlements** - Payments processed in under a second
- ✅ **No Gas Fees for You** - 0xGasless handles all gas costs
- ✅ **Built for Avalanche** - Optimized for Avalanche C-Chain
- ✅ **Perfect for AI Agents** - Financial autonomy for autonomous agents
- ✅ **Microtransactions** - Accept payments from $0.01

## 🔍 Understanding the Previous Issue

### The Problem (Before Using 0xGasless)

When you saw a transaction with `txHash: "0xpending000..."`, it indicated that the payment verification succeeded but the transaction was never submitted to the blockchain.

### Why It Happened

The original code only called `verify()` which validated payment signatures but never called `settle()` to submit transactions on-chain.

### The Solution

We now send payments to the **0xGasless facilitator service**, which handles both verification **and** settlement automatically. 0xGasless:

1. Verifies the payment signature
2. Submits the transaction to Avalanche blockchain
3. Returns the real transaction hash

## ⚙️ Configuration

### Option 1: Use Default (Recommended)

The code already defaults to 0xGasless. No configuration needed!

```typescript
// In your code (already configured):
const facilitatorUrl =
  process.env.FACILITATOR_URL ?? "https://x402.0xgasless.com/";
```

### Option 2: Set Environment Variable (Optional)

If you want to explicitly set it or use a different facilitator:

```env
# .env.local
FACILITATOR_URL=https://x402.0xgasless.com/
```

## 🎯 How It Works

### Payment Flow with 0xGasless

```
┌─────────┐                ┌─────────────┐                ┌──────────────┐
│  User   │                │ Your Server │                │  0xGasless   │
│ Wallet  │                │             │                │ Facilitator  │
└────┬────┘                └──────┬──────┘                └──────┬───────┘
     │                            │                              │
     │  1. Sign authorization     │                              │
     │  (EIP-712 message)         │                              │
     ├──────────────────────────► │                              │
     │                            │                              │
     │                            │  2. Forward to 0xGasless     │
     │                            ├────────────────────────────► │
     │                            │                              │
     │                            │                       3. Verify signature
     │                            │                       4. Submit to blockchain
     │                            │                       5. Pay gas fees
     │                            │                              │
     │                            │  6. Return txHash            │
     │                            │  ◄──────────────────────────┤
     │                            │                              │
     │  7. Return txHash          │                              │
     │  ◄──────────────────────── │                              │
     │                            │                              │
```

### What 0xGasless Does

1. **Receives** your payment authorization and requirements
2. **Verifies** the cryptographic signature
3. **Submits** the transaction to Avalanche blockchain
4. **Pays** gas fees from their facilitator wallet
5. **Returns** the real transaction hash to you

## 💰 Pricing & Economics

### For You (Merchant)

- **Setup Cost**: $0 (no API keys, no accounts)
- **Transaction Fee**: Built into the payment flow
- **Gas Fees**: $0 (0xGasless pays them)
- **Maintenance**: $0 (fully managed service)

### For Users

- **Payment**: Whatever you charge (e.g., $0.10 USDC)
- **Gas Fees**: $0 (gasless for users!)
- **Only Need**: USDC on Avalanche

### Example Economics

If you charge $0.10 per payment:

- User pays: $0.10 USDC
- 0xGasless fee: Built into their service
- You receive: Payment minus any service fees
- You manage: Nothing (fully automated)

## 🚀 Getting Started

### Step 1: Ensure Network Configuration

Make sure your environment is set for Avalanche:

```env
# .env.local (optional, these are defaults)
PAYMENT_NETWORK=avalanche
FACILITATOR_URL=https://x402.0xgasless.com/
```

### Step 2: Run Your Application

```bash
npm run dev
```

### Step 3: Test a Payment

1. Navigate to your payment page
2. Connect MetaMask with USDC on Avalanche
3. Sign the payment authorization
4. See the real transaction hash returned!

### Step 4: Verify on Blockchain

Check the transaction on [Snowtrace](https://snowtrace.io/):

```
https://snowtrace.io/tx/0x[your-transaction-hash]
```

## 🔍 Comparison: Self-Hosted vs 0xGasless

| Feature          | Self-Hosted Facilitator         | 0xGasless Facilitator    |
| ---------------- | ------------------------------- | ------------------------ |
| Setup Complexity | High (wallet, gas, monitoring)  | **None** (plug & play)   |
| Gas Fees         | You pay (~$0.04/tx)             | **0xGasless pays**       |
| Maintenance      | Required (wallet balance, keys) | **None** (managed)       |
| Latency          | Direct (faster)                 | Network call (very fast) |
| Control          | Full control                    | Service dependency       |
| Security         | Manage private keys             | **No keys needed**       |
| Cost             | Gas fees                        | Service fees             |
| Uptime           | Your responsibility             | **99.9% SLA**            |

## 🧪 Testing

### Test on Avalanche Mainnet

```bash
# 1. Get USDC on Avalanche
# - Use Core Wallet: https://core.app/
# - Or bridge from other chains

# 2. Run your app
npm run dev

# 3. Complete a payment
# 4. Check logs for real transaction hash
```

### Verify Transaction

After payment, you should see in server logs:

```
Sending payment to 0xGasless facilitator: https://x402.0xgasless.com/
0xGasless facilitator response: {
  success: true,
  isValid: true,
  payer: '0x...',
  txHash: '0x1a2b3c4d...'  // Real transaction hash!
}
```

Then verify on blockchain:

```
Visit: https://snowtrace.io/tx/0x1a2b3c4d...
```

## 🔐 Security

### What You Don't Need

✅ No private keys to manage
✅ No wallet to fund
✅ No gas fees to monitor
✅ No secret keys in environment

### What 0xGasless Handles

- Payment signature verification
- Transaction submission
- Gas fee management
- Blockchain interaction
- Error handling

### What You Control

- Payment amounts
- Recipient addresses
- Payment requirements
- User experience

## 📊 API Reference

### Request to 0xGasless

```typescript
POST https://x402.0xgasless.com/

Body:
{
  "payload": {
    "x402Version": 1,
    "scheme": "exact",
    "network": "avalanche",
    "payload": {
      "signature": "0x...",
      "authorization": {
        "from": "0x...",
        "to": "0x...",
        "value": "70000",
        "validAfter": "1234567890",
        "validBefore": "1234571490",
        "nonce": "0x..."
      }
    }
  },
  "requirements": {
    "scheme": "exact",
    "network": "avalanche",
    "maxAmountRequired": "70000",
    "resource": "/api/mesh-distribute",
    "description": "Mesh payment distribution",
    "mimeType": "application/json",
    "payTo": "0x...",
    "maxTimeoutSeconds": 3600,
    "asset": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
  }
}
```

### Response from 0xGasless

```json
{
  "success": true,
  "isValid": true,
  "payer": "0x...",
  "txHash": "0x1a2b3c4d5e6f7890abcdef..."
}
```

## 🆘 Troubleshooting

### "Unable to reach facilitator service"

**Problem:** Network connectivity to 0xGasless

**Solution:**

```bash
# 1. Check if 0xGasless is online
curl https://x402.0xgasless.com/

# 2. Check your internet connection
# 3. Check firewall settings
```

### "Payment verification failed"

**Problem:** Invalid payment signature or expired authorization

**Solution:**

- Ensure user signs with the correct wallet
- Check that authorization hasn't expired (validBefore timestamp)
- Verify payment amount meets requirements

### "0xGasless returned 500"

**Problem:** Internal error on 0xGasless side

**Solution:**

- Check [0xGasless status](https://x402.0xgasless.com/)
- Wait a few moments and retry
- Contact 0xGasless support if persistent

### Still seeing "0xpending..." hash

**Problem:** Transaction not being processed

**Solution:**

1. Check server logs for facilitator response
2. Verify FACILITATOR_URL is set correctly
3. Ensure network is "avalanche"
4. Check that user has sufficient USDC

## 📚 Additional Resources

- **0xGasless Website**: https://x402.0xgasless.com/
- **0xGasless Twitter**: [@0xGasless](https://twitter.com/0xGasless)
- **x402 Protocol**: https://www.x402.org/
- **Avalanche Docs**: https://docs.avax.network/
- **Core Wallet**: https://core.app/

## 🎯 Migration from Self-Hosted

If you're migrating from a self-hosted facilitator:

### Before (Self-Hosted)

```typescript
const facilitatorPrivateKey = process.env.FACILITATOR_PRIVATE_KEY;
const facilitatorWallet = createWalletClient({...});
const settleResponse = await settle(facilitatorWallet, payload, requirements);
```

### After (0xGasless)

```typescript
const facilitatorUrl = "https://x402.0xgasless.com/";
const response = await fetch(facilitatorUrl, {
  method: "POST",
  body: JSON.stringify({ payload, requirements }),
});
```

### What to Remove

❌ Remove `FACILITATOR_PRIVATE_KEY` from `.env`
❌ Remove wallet funding/monitoring
❌ Remove gas fee tracking
❌ Remove facilitator wallet management

### What to Keep

✅ Payment flow logic
✅ User interface
✅ Payment requirements
✅ Error handling

## 🌟 Benefits of 0xGasless

### For Developers

- 🚀 **2-minute setup** - Just set the URL and go
- 🔧 **Zero maintenance** - No infrastructure to manage
- 💰 **No upfront costs** - Pay only per transaction
- 📈 **Scales automatically** - Handle any volume

### For Users

- ⚡ **Gasless payments** - No AVAX needed
- 🔒 **Secure** - Sign messages, not transactions
- 💸 **Cheap** - Only pay the amount you authorize
- 🎯 **Simple** - One signature, done

### For Your Business

- 💵 **Lower costs** - No gas fees to manage
- ⏱️ **Faster time-to-market** - Launch in minutes
- 🛡️ **Less risk** - No private keys to protect
- 📊 **Better UX** - Seamless payment experience

## ✨ Summary

**Before:** Self-hosted facilitator requiring private keys, gas fees, and maintenance

**Now:** 0xGasless handles everything automatically

**Setup:** Set `FACILITATOR_URL=https://x402.0xgasless.com/` (or use default)

**Result:** Real blockchain transactions with zero infrastructure management

---

**🎉 You're now using the 0xGasless x402 Facilitator for hassle-free Avalanche payments!**

For support or questions, visit [0xGasless](https://x402.0xgasless.com/) or check their [documentation](https://x402.0xgasless.com/).
