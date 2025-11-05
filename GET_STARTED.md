# 🚀 Get Started with x402 Payment Protocol

Welcome! You're 3 steps away from having a working crypto paywall.

---

## Step 1: Create Your `.env` File

Copy and paste this into a new file called `.env` in the project root:

```env
WALLET_ADDRESS=0xYourWalletAddressHere
NODE_ENV=development
PAYMENT_AMOUNT=$0.10
PAYMENT_CURRENCY=USDC
PAYMENT_NETWORK=base-sepolia
FACILITATOR_URL=https://x402.org/facilitator
```

**Replace `0xYourWalletAddressHere` with your actual Ethereum wallet address.**

### Where to find your wallet address:
1. Open MetaMask
2. Click on your account name at the top
3. Your address will be copied to clipboard
4. Paste it in the `.env` file

---

## Step 2: Get Free Test USDC

1. Visit: **https://faucet.circle.com/**
2. Select network: **Base Sepolia**
3. Paste your wallet address
4. Click "Request USDC"
5. Wait a few seconds - you'll get 10 USDC for free!

---

## Step 3: Run the App

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Test the Payment Flow

1. Click **"Pay $0.10 to Access Video"**
2. MetaMask will pop up - click **"Connect"**
3. If prompted, click **"Switch Network"** to Base Sepolia
4. Sign the payment message (no gas fees!)
5. **Success!** You'll see the premium video

---

## That's It! 🎉

You've successfully implemented x402 payment protocol.

### What Just Happened?

- You signed a **gasless** payment authorization
- The x402 protocol verified your signature
- A facilitator settled the payment on blockchain
- You got instant access to premium content

No credit cards. No KYC. No accounts.  
Just pure, internet-native payments. 🚀

---

## Next Steps

- **Read the docs**: Check out `README.md` for full documentation
- **Customize**: Change `PAYMENT_AMOUNT` to set your own price
- **Deploy**: Use `vercel` to deploy to production
- **Go live**: Switch to `base-mainnet` when ready

---

## Need Help?

- **Configuration issues**: Run `node scripts/check-env.js`
- **Payment errors**: Check browser console (F12)
- **Network issues**: Make sure you're on Base Sepolia
- **Still stuck**: See `IMPLEMENTATION_GUIDE.md` for detailed help

---

## Resources

- 📖 [x402 Protocol](https://www.x402.org/)
- 💧 [USDC Faucet](https://faucet.circle.com/)
- 🔍 [Base Sepolia Explorer](https://sepolia.basescan.org/)
- 🦊 [Install MetaMask](https://metamask.io/)

---

**Happy building! ⚡️**

