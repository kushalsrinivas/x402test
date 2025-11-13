// x402 Payment Verification

import type { PaymentPayload, X402PaymentPayload, PaymentVerificationResult, X402Config } from './types';
import { logPayment, priceToWei } from './utils';

// Dynamic import for x402 facilitator module
// The x402 package exports verify and settle functions from 'x402/facilitator'

// x402 verify response type
type X402VerifyResponse = {
  isValid: boolean;
  invalidReason?: string;
  payer?: string;
  payee?: string;
  value?: string;
  txHash?: string;
};

// Viem client type (simplified for x402 compatibility)
type ViemClient = Record<string, unknown> & {
  chain?: unknown;
  transport?: unknown;
};

// x402 payment requirements type
type X402PaymentRequirements = {
  scheme: 'exact';
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
};

// x402 config type
type X402VerifyConfig = Record<string, unknown>;

type VerifyFunction = (
  client: ViemClient,
  payload: X402PaymentPayload,
  requirements: X402PaymentRequirements,
  config?: X402VerifyConfig
) => Promise<X402VerifyResponse>;

async function getX402Verify(): Promise<VerifyFunction> {
  const facilitator = await import('x402/facilitator');
  return facilitator.verify as VerifyFunction;
}

/**
 * Check if payload is x402 v1 format
 */
function isX402PaymentPayload(payload: PaymentPayload): payload is X402PaymentPayload {
  return 'x402Version' in payload && payload.x402Version === 1;
}

/**
 * Verifies a payment payload using the x402 package
 */
export async function verifyPaymentWithFacilitator(
  payload: PaymentPayload,
  config: X402Config
): Promise<PaymentVerificationResult> {
  try {
    logPayment('Verifying payment with x402 package', { payload, config });

    // Ensure we have x402 v1 format
    if (!isX402PaymentPayload(payload)) {
      return {
        valid: false,
        message: 'Invalid payment payload format. Expected x402 v1 format.',
      };
    }

    // Import viem dynamically
    const { createPublicClient, http } = await import('viem');
    const { baseSepolia } = await import('viem/chains');

    // Create viem public client for the network
    const client = createPublicClient({
      chain: baseSepolia, // TODO: Make this dynamic based on config.network
      transport: http(),
    });

    // Convert price to wei (USDC has 6 decimals)
    const maxAmountRequired = priceToWei(config.price);

    // Build payment requirements matching x402 spec
    const paymentRequirements = {
      scheme: 'exact' as const,
      network: payload.network,
      maxAmountRequired: maxAmountRequired.toString(),
      resource: '/api/authenticate',
      description: 'Payment required for access',
      mimeType: 'application/json',
      payTo: config.walletAddress,
      maxTimeoutSeconds: 3600,
      asset: getUSDCAddress(payload.network),
    };

    logPayment('Calling x402.verify with requirements', paymentRequirements);

    // Use the x402 package's verify function
    const verify = await getX402Verify();
    const verifyResponse = await verify(
      client,
      payload,
      paymentRequirements
    );

    logPayment('x402.verify response', verifyResponse);

    if (verifyResponse.isValid) {
      return {
        valid: true,
        message: 'Payment verified successfully',
        txHash: verifyResponse.txHash,
      };
    } else {
      return {
        valid: false,
        message: verifyResponse.invalidReason ?? 'Payment verification failed',
      };
    }
  } catch (error) {
    console.error('Error verifying payment with x402:', error);
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown verification error',
    };
  }
}

/**
 * Get USDC address for the network
 */
function getUSDCAddress(network: string): string {
  const usdcAddresses: Record<string, string> = {
    'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    'base': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    'avalanche-fuji': '0x5425890298aed601595a70AB815c96711a31Bc65',
    'avalanche': '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  };
  return usdcAddresses[network] ?? usdcAddresses['base-sepolia']!;
}

/**
 * Basic validation of payment payload structure
 */
export function validatePaymentPayload(payload: PaymentPayload): boolean {
  // Check if it's x402 v1 format
  if ('x402Version' in payload) {
    return !!(
      payload.x402Version === 1 &&
      payload.scheme === 'exact' &&
      payload.network &&
      payload.payload?.signature &&
      payload.payload?.authorization?.from &&
      payload.payload?.authorization?.to &&
      payload.payload?.authorization?.value &&
      payload.payload?.authorization?.nonce &&
      payload.payload?.authorization?.validAfter &&
      payload.payload?.authorization?.validBefore
    );
  }
  
  // Legacy format validation (backwards compatibility)
  return !!(
    'from' in payload &&
    payload.from &&
    'to' in payload &&
    payload.to &&
    'value' in payload &&
    payload.value &&
    'nonce' in payload &&
    payload.nonce &&
    'validAfter' in payload &&
    typeof payload.validAfter === 'number' &&
    'validBefore' in payload &&
    typeof payload.validBefore === 'number' &&
    'v' in payload &&
    typeof payload.v === 'number' &&
    'r' in payload &&
    payload.r &&
    's' in payload &&
    payload.s
  );
}

/**
 * Checks if payment amount is sufficient
 */
export function isPaymentAmountSufficient(
  payload: PaymentPayload,
  requiredValue: bigint
): boolean {
  try {
    let paymentValue: string;
    
    // Extract value based on payload format
    if ('x402Version' in payload) {
      paymentValue = payload.payload.authorization.value;
    } else {
      paymentValue = payload.value;
    }
    
    const paymentAmount = BigInt(paymentValue);
    return paymentAmount >= requiredValue;
  } catch {
    return false;
  }
}

/**
 * Checks if payment is within valid time window
 */
export function isPaymentTimeValid(
  payload: PaymentPayload
): boolean {
  try {
    let validAfter: number;
    let validBefore: number;
    
    // Extract time values based on payload format
    if ('x402Version' in payload) {
      validAfter = parseInt(payload.payload.authorization.validAfter);
      validBefore = parseInt(payload.payload.authorization.validBefore);
    } else {
      validAfter = payload.validAfter;
      validBefore = payload.validBefore;
    }
    
    const now = Math.floor(Date.now() / 1000);
    return now >= validAfter && now <= validBefore;
  } catch {
    return false;
  }
}

