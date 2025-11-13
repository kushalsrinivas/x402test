// API Route: /api/process-x402-payment
// Processes x402 payment using the official x402 package

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Supported x402 networks (matches x402 package's Network type)
type X402Network = 
  | 'base-sepolia' 
  | 'base' 
  | 'avalanche-fuji' 
  | 'avalanche' 
  | 'abstract' 
  | 'abstract-testnet' 
  | 'sei' 
  | 'sei-testnet' 
  | 'polygon' 
  | 'polygon-amoy' 
  | 'peaq' 
  | 'iotex' 
  | 'solana-devnet' 
  | 'solana';

// x402 v1 Payment Payload format
interface X402PaymentPayload {
  x402Version: 1;
  scheme: 'exact';
  network: X402Network;
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      validAfter: string;
      validBefore: string;
      nonce: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      payload: X402PaymentPayload;
      paymentRequirements: {
        scheme: 'exact';
        network: X402Network;
        maxAmountRequired: string;
        resource: string;
        description: string;
        mimeType: string;
        payTo: string;
        maxTimeoutSeconds: number;
        asset: string;
      };
    };

    const { payload, paymentRequirements } = body;

    // Validate x402 v1 payload structure
    if (!payload?.x402Version || payload.x402Version !== 1) {
      return NextResponse.json(
        { error: "Invalid payment payload: x402Version must be 1" },
        { status: 400 }
      );
    }

    if (!payload.payload?.signature || !payload.payload?.authorization) {
      return NextResponse.json(
        { error: "Invalid payment payload: missing signature or authorization" },
        { status: 400 }
      );
    }

    const auth = payload.payload.authorization;
    if (!auth.from || !auth.to || !auth.value) {
      return NextResponse.json(
        { error: "Invalid payment payload: missing required authorization fields" },
        { status: 400 }
      );
    }

    console.log("Processing x402 payment:", {
      from: auth.from,
      to: auth.to,
      value: auth.value,
      network: payload.network,
    });

    // Import x402 verify function and viem dynamically
    const { verify } = await import('x402/facilitator');
    const { createPublicClient, http } = await import('viem');
    const { avalanche } = await import('viem/chains');

    // Create viem client for Avalanche C-Chain
    const client = createPublicClient({
      chain: avalanche,
      transport: http('https://api.avax.network/ext/bc/C/rpc'),
    });

    // Verify the payment using x402 package
    const verifyResponse = await verify(

      client,
      payload,
      paymentRequirements
    );

    console.log("x402 verify response:", {
      isValid: verifyResponse.isValid,
      invalidReason: verifyResponse.invalidReason,
      payer: verifyResponse.payer,
    });

    if (!verifyResponse.isValid) {
      return NextResponse.json(
        {
          error: "Payment verification failed",
          reason: verifyResponse.invalidReason ?? "Unknown verification error",
        },
        { status: 402 }
      );
    }

    // Payment verified successfully
    return NextResponse.json({
      success: true,
      isValid: verifyResponse.isValid,
      payer: verifyResponse.payer,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

