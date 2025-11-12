# Multi-Wallet Mesh Token Distribution

## Overview

The Multi-Wallet Mesh Token Distribution feature demonstrates X402's peer-to-peer payment capabilities by creating a dynamic transaction network where all provided wallets exchange tokens with each other randomly.

## Features

### Core Functionality

1. **Multiple Wallet Support** - Add 2 or more participating wallets
2. **Token Selection** - Choose from USDC, USDT, or DAI (or any combination)
3. **Amount Range** - Set minimum and maximum transaction amounts
4. **Configurable Transactions** - Specify the number of transactions (1-100)

### Automated Behavior

- **Random Sender Selection** - Any wallet can be randomly selected as the sender
- **Random Recipient Selection** - Any other wallet (different from sender) can be the recipient
- **Random Token Selection** - Chooses from available tokens for each transaction
- **Random Amount** - Generates amount within specified range
- **Real-time Updates** - Live transaction status updates via Server-Sent Events (SSE)

## Example Flow

If wallets are `[A, B, C, D]`:
- Wallet A → sends Token X ($0.05) to Wallet C
- Wallet C → sends Token Y ($0.08) to Wallet B
- Wallet D → sends Token Z ($0.03) to Wallet A
- Wallet B → sends Token X ($0.10) to Wallet D
- (continues randomly based on configuration)

## Technical Implementation

### Frontend (`/mesh-payments`)

**File:** `src/app/mesh-payments/page.tsx`

- Built with Next.js App Router and React
- Client-side state management for wallets, tokens, and transactions
- Real-time transaction updates via streaming API
- Responsive UI matching the app's theme (slate/red gradient aesthetic)

Key Components:
- Configuration Panel - Set up wallets, tokens, amounts
- Transaction Log - Real-time display of transaction network
- Statistics Dashboard - Success/failure counts

### Backend API (`/api/mesh-distribute`)

**File:** `src/app/api/mesh-distribute/route.ts`

- Streaming endpoint using Server-Sent Events (SSE)
- Random selection algorithms for sender, recipient, token, and amount
- Simulated X402 facilitator integration
- Transaction orchestration and status tracking

### Data Flow

```
User Input → Validation → API Request → Stream Response
                                            ↓
                                    Random Selection
                                            ↓
                                    X402 Processing
                                            ↓
                                    Status Updates (SSE)
                                            ↓
                                    Frontend Display
```

## Usage

### Access the Feature

1. Navigate to the homepage
2. Click "Try Mesh Distribution" in the Multi-Wallet Mesh Distribution card
3. Or directly visit `/mesh-payments`

### Configuration Steps

1. **Add Wallets**
   - Enter at least 2 Ethereum wallet addresses (0x...)
   - Click "+ Add Wallet" to add more participants
   - Remove wallets with the trash icon (minimum 2 required)

2. **Select Tokens**
   - Choose one or more tokens (USDC, USDT, DAI)
   - At least one token must be selected

3. **Set Amount Range**
   - Min Amount: Minimum transaction amount in dollars
   - Max Amount: Maximum transaction amount in dollars
   - Must be positive, min ≤ max

4. **Configure Transactions**
   - Set the number of transactions to process (1-100)

5. **Start Distribution**
   - Click "Start Mesh Distribution"
   - Watch real-time transaction updates
   - View success/failure statistics

## Transaction States

- **Pending** (⏱️ Gray) - Transaction queued
- **Processing** (⚡ Yellow) - Currently being processed by X402
- **Success** (✓ Green) - Transaction completed successfully
- **Error** (✗ Red) - Transaction failed with error message

## Input Validation

The system validates:
- All wallet addresses are filled
- Wallet addresses match Ethereum format (0x + 40 hex characters)
- No duplicate wallet addresses
- Amount range is valid (positive, min ≤ max)
- Number of transactions is between 1 and 100
- At least one token is selected

## X402 Integration

The feature demonstrates how X402 facilitator can handle:
- **Multi-directional payment flows** - Payments between any wallets
- **Complex transaction routing** - Dynamic sender/recipient selection
- **Decentralized payment networks** - True peer-to-peer exchanges
- **Real peer-to-peer token exchanges** - No centralized intermediary needed

## Theme and Design

The interface follows the app's design system:
- **Background**: Slate gradient with red/rose accents
- **Cards**: Glassmorphism with backdrop blur
- **Primary Actions**: Red-to-rose gradient buttons
- **Status Colors**: 
  - Success: Emerald green
  - Error: Red
  - Processing: Yellow
  - Info: Gray
- **Typography**: Geist font family
- **Animations**: Smooth transitions and hover effects

## API Response Format

The API uses Server-Sent Events (SSE) format:

```
data: {"transaction":{"id":"tx-123","from":"0x...","to":"0x...","token":"USDC","amount":"0.05","status":"pending","timestamp":1234567890}}

data: {"transaction":{"id":"tx-123","from":"0x...","to":"0x...","token":"USDC","amount":"0.05","status":"processing","timestamp":1234567890}}

data: {"transaction":{"id":"tx-123","from":"0x...","to":"0x...","token":"USDC","amount":"0.05","status":"success","timestamp":1234567890,"txHash":"0x..."}}

data: {"complete":true}
```

## Future Enhancements

Potential improvements for production use:
1. **Real X402 Integration** - Connect to actual X402 facilitator
2. **Wallet Connection** - Use MetaMask/Web3 for actual wallet signing
3. **Balance Checking** - Verify sufficient balances before transactions
4. **Transaction History** - Persist and display historical transactions
5. **Export Data** - Download transaction logs as CSV/JSON
6. **Advanced Filters** - Filter transactions by wallet, token, or status
7. **Network Selection** - Support multiple blockchain networks
8. **Gas Estimation** - Display estimated gas costs
9. **Batch Operations** - Group transactions for efficiency
10. **Analytics Dashboard** - Visualize transaction patterns and statistics

## Notes

- Current implementation uses simulated X402 processing for demonstration
- Transaction hashes are mock values generated for display purposes
- 90% success rate is hardcoded for realistic simulation
- Network delays are simulated (1-3 seconds per transaction)
- No actual blockchain transactions occur in this demo

## Related Files

- Frontend: `src/app/mesh-payments/page.tsx`
- API Route: `src/app/api/mesh-distribute/route.ts`
- Homepage Link: `src/app/page.tsx` (lines 241-300)
- X402 Library: `src/lib/x402/`

---

Built with ❤️ using the x402 Payment Protocol

