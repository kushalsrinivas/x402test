// API Route: /api/payment-info
// Returns payment information for the client

import { NextResponse } from 'next/server';
import { NETWORKS } from '~/lib/x402';
import type { NetworkName } from '~/lib/x402';

export async function GET() {
  const walletAddress = process.env.WALLET_ADDRESS ?? '0x0000000000000000000000000000000000000000';
  const paymentAmount = process.env.PAYMENT_AMOUNT ?? '$0.10';
  const network = (process.env.PAYMENT_NETWORK ?? 'base-sepolia') as NetworkName;
  
  const networkConfig = NETWORKS[network];

  // Validate that network configuration exists
  if (!networkConfig) {
    return NextResponse.json(
      { 
        error: `Invalid network configuration for: ${network}`,
        availableNetworks: Object.keys(NETWORKS)
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    walletAddress,
    paymentAmount,
    network,
    networkConfig,
    facilitatorUrl: process.env.FACILITATOR_URL ?? 'https://x402.org/facilitator',
  });
}

