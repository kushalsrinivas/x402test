// x402 Payment Middleware for Next.js

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { X402Config } from './types';
import {
  create402Response,
  extractPaymentPayload,
  priceToWei,
  logPayment,
} from './utils';
import {
  validatePaymentPayload,
  verifyPaymentWithFacilitator,
  isPaymentAmountSufficient,
  isPaymentTimeValid,
} from './verify';
import { DEFAULT_FACILITATOR_URL } from './constants';

/**
 * x402 Payment Middleware
 * Checks for payment and validates it before allowing access to protected resources
 */
export async function x402Middleware(
  request: NextRequest,
  config: X402Config
): Promise<NextResponse | null> {
  logPayment(`Processing request: ${request.method} ${request.nextUrl.pathname}`);

  // Extract payment from headers
  const paymentPayload = extractPaymentPayload(request);

  // If no payment provided, return 402
  if (!paymentPayload) {
    logPayment('No payment provided, returning 402 response');
    const response = create402Response(config);
    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  // Validate payment structure
  if (!validatePaymentPayload(paymentPayload)) {
    logPayment('Invalid payment payload structure');
    return NextResponse.json(
      { error: 'Invalid payment payload' },
      { status: 400 }
    );
  }

  // Check payment amount
  const requiredAmount = priceToWei(config.price);
  if (!isPaymentAmountSufficient(paymentPayload, requiredAmount)) {
    logPayment('Insufficient payment amount', {
      required: requiredAmount.toString(),
    });
    return NextResponse.json(
      { error: 'Insufficient payment amount' },
      { status: 402 }
    );
  }

  // Check payment time validity
  if (!isPaymentTimeValid(paymentPayload)) {
    logPayment('Payment time window invalid');
    return NextResponse.json(
      { error: 'Payment has expired or is not yet valid' },
      { status: 402 }
    );
  }

  // Verify payment with x402 package
  const verificationResult = await verifyPaymentWithFacilitator(
    paymentPayload,
    config
  );

  if (!verificationResult.valid) {
    logPayment('Payment verification failed', verificationResult);
    return NextResponse.json(
      {
        error: 'Payment verification failed',
        message: verificationResult.message,
      },
      { status: 402 }
    );
  }

  logPayment('Payment verified successfully', {
    txHash: verificationResult.txHash,
  });

  // Payment is valid, allow request to proceed
  return null;
}

