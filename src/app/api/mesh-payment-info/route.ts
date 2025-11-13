// API Route: /api/mesh-payment-info
// Returns payment information for mesh payments using Avalanche and 0xGasless facilitator

import { NextResponse } from 'next/server';
import { NETWORKS, AVALANCHE_FACILITATOR_URL } from '~/lib/x402';
import type { NetworkName } from '~/lib/x402';

export async function GET() {
  const walletAddress = process.env.WALLET_ADDRESS ?? '0x0000000000000000000000000000000000000000';
  const paymentAmount = process.env.PAYMENT_AMOUNT ?? '$0.10';
  const network = 'avalanche' as NetworkName; // Always use Avalanche for mesh payments
  
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
    facilitatorUrl: AVALANCHE_FACILITATOR_URL, // Use 0xGasless facilitator
  });
}

