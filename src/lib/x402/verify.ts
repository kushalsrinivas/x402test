// x402 Payment Verification

import type { PaymentPayload, PaymentVerificationResult } from './types';
import { logPayment } from './utils';

/**
 * Verifies a payment payload with the facilitator
 */
export async function verifyPaymentWithFacilitator(
  payload: PaymentPayload,
  facilitatorUrl: string
): Promise<PaymentVerificationResult> {
  try {
    logPayment('Verifying payment with facilitator', { facilitatorUrl, payload });

    const response = await fetch(facilitatorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'verifyPayment',
        payload,
      }),
    });

    if (!response.ok) {
      return {
        valid: false,
        message: `Facilitator verification failed: ${response.statusText}`,
      };
    }

    const result = await response.json() as {
      valid?: boolean;
      message?: string;
      txHash?: string;
    };
    
    logPayment('Facilitator verification result', result);

    return {
      valid: result.valid === true,
      message: result.message,
      txHash: result.txHash,
    };
  } catch (error) {
    console.error('Error verifying payment with facilitator:', error);
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown verification error',
    };
  }
}

/**
 * Basic validation of payment payload structure
 */
export function validatePaymentPayload(payload: PaymentPayload): boolean {
  return !!(
    payload.from &&
    payload.to &&
    payload.value &&
    payload.nonce &&
    typeof payload.validAfter === 'number' &&
    typeof payload.validBefore === 'number' &&
    typeof payload.v === 'number' &&
    payload.r &&
    payload.s
  );
}

/**
 * Checks if payment amount is sufficient
 */
export function isPaymentAmountSufficient(
  paymentValue: string,
  requiredValue: bigint
): boolean {
  try {
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
  validAfter: number,
  validBefore: number
): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= validAfter && now <= validBefore;
}

