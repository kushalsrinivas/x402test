# 🚀 Quick Start Guide - x402 Payment Protocol Demo

Get up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Copy the example below and replace with your values
WALLET_ADDRESS=0xYourWalletAddressHere
NODE_ENV=development
PAYMENT_AMOUNT=$0.10
PAYMENT_CURRENCY=USDC
PAYMENT_NETWORK=base-sepolia
FACILITATOR_URL=https://x402.org/facilitator
```

**Where to get your wallet address:**
- Open MetaMask
- Click on your account name at the top
- Your address will be copied to clipboard

## Step 3: Get Test USDC

1. Visit [Circle USDC Faucet](https://faucet.circle.com/)
2. Select **Base Sepolia** network
3. Paste your wallet address
4. Request USDC (you'll get 10 USDC for free)

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Paywall

1. Click **"Pay $0.10 to Access Video"**
2. MetaMask will open - click **"Connect"**
3. Sign the payment message (no gas required!)
4. Enjoy your premium content! 🎉

---

## Troubleshooting

### "MetaMask is not installed"
→ Install [MetaMask extension](https://metamask.io/download/)

### "Insufficient funds"
→ Make sure you completed Step 3 above

### "Wrong network"
→ Click "Switch Network" when prompted by MetaMask

### Still having issues?
→ Check the [full setup guide](./ENV_SETUP.md)

---

## What's Next?

- **Deploy to production**: See [README.md](./README.md#-deployment)
- **Customize payment amount**: Edit `PAYMENT_AMOUNT` in `.env`
- **Switch to mainnet**: Change `PAYMENT_NETWORK=base-mainnet`
- **Learn more**: Visit [x402.org](https://www.x402.org/)

---

## 🎯 Architecture Overview

```
User → Homepage → Click Pay → Authenticate Page
                                    ↓
                              Connect Wallet
                                    ↓
                         Sign Payment (ERC-3009)
                                    ↓
                    Send to /api/authenticate with X-PAYMENT
                                    ↓
                        Server verifies with Facilitator
                                    ↓
                          Video Content (Protected)
```

## 📁 Key Files

- `src/app/page.tsx` - Homepage with paywall button
- `src/app/authenticate/page.tsx` - Payment processing
- `src/app/video-content/page.tsx` - Protected content
- `src/app/api/authenticate/route.ts` - x402 verification
- `src/lib/x402/` - x402 protocol implementation
- `src/components/X402PaymentClient.tsx` - Wallet integration

---

**Happy building with x402! 🚀**

