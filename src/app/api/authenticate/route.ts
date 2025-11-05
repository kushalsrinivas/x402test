// API Route: /api/authenticate
// Handles x402 payment authentication

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { x402Middleware } from '~/lib/x402';

// Configuration for x402 payment
const X402_CONFIG = {
  walletAddress: process.env.WALLET_ADDRESS ?? '0x0000000000000000000000000000000000000000',
  price: process.env.PAYMENT_AMOUNT ?? '$0.10',
  network: process.env.PAYMENT_NETWORK ?? 'avalanche-mainnet',
  facilitatorUrl: process.env.FACILITATOR_URL,
};

export async function GET(request: NextRequest) {
  // Check payment with x402 middleware
  const paymentResponse = await x402Middleware(request, X402_CONFIG);
  
  if (paymentResponse) {
    // Payment not valid or not provided
    return paymentResponse;
  }

  // Payment successful - redirect to video content
  return NextResponse.redirect(new URL('/video-content', request.url));
}

export async function POST(request: NextRequest) {
  // Support POST requests as well
  return GET(request);
}

