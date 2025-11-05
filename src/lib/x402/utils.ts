// x402 Payment Protocol Utility Functions

import { NETWORKS, PAYMENT_HEADERS } from './constants';
import type { NetworkName } from './constants';
import type { PaymentDetails, PaymentPayload, X402Config } from './types';

/**
 * Creates a 402 Payment Required response
 */
export function create402Response(config: X402Config): Response {
  const network = config.network as NetworkName;
  const networkConfig = NETWORKS[network];

  if (!networkConfig) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const paymentDetails: PaymentDetails = {
    maxAmountRequired: config.price,
    resource: '/api/authenticate',
    description: 'Payment required for access',
    payTo: config.walletAddress,
    asset: networkConfig.usdcAddress,
    network: network,
  };

  return new Response(JSON.stringify(paymentDetails), {
    status: 402,
    headers: {
      'Content-Type': 'application/json',
      [PAYMENT_HEADERS.PAYMENT_REQUIRED]: `x402 ${JSON.stringify(paymentDetails)}`,
    },
  });
}

/**
 * Extracts payment payload from request headers
 */
export function extractPaymentPayload(request: Request): PaymentPayload | null {
  const paymentHeader = request.headers.get(PAYMENT_HEADERS.PAYMENT);
  
  if (!paymentHeader) {
    return null;
  }

  try {
    return JSON.parse(paymentHeader) as PaymentPayload;
  } catch (error) {
    console.error('Failed to parse payment header:', error);
    return null;
  }
}

/**
 * Converts price in dollars to wei (assuming 6 decimals for USDC)
 */
export function priceToWei(priceUSD: string): bigint {
  const price = parseFloat(priceUSD.replace('$', ''));
  // USDC has 6 decimals
  return BigInt(Math.floor(price * 1_000_000));
}

/**
 * Formats wallet address for display
 */
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generates a random nonce for payment
 */
export function generateNonce(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return '0x' + Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Logs payment information
 */
export function logPayment(message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  console.log(`[x402 ${timestamp}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

