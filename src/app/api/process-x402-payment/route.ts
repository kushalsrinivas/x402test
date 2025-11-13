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

    // Use 0xGasless facilitator service to verify and settle the payment
    const facilitatorUrl = process.env.FACILITATOR_URL ?? 'https://x402.0xgasless.com/';
    
    console.log("Sending payment to 0xGasless facilitator:", facilitatorUrl);

    try {
      // Send the payment to 0xGasless facilitator for verification and settlement
      // 0xGasless handles both verification and on-chain settlement automatically
      const facilitatorResponse = await fetch(facilitatorUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: payload,
          requirements: paymentRequirements,
        }),
      });

      if (!facilitatorResponse.ok) {
        const errorText = await facilitatorResponse.text();
        console.error("0xGasless facilitator error:", {
          status: facilitatorResponse.status,
          statusText: facilitatorResponse.statusText,
          body: errorText,
        });

        return NextResponse.json(
          {
            error: "Facilitator processing failed",
            reason: `0xGasless returned ${facilitatorResponse.status}: ${errorText}`,
          },
          { status: facilitatorResponse.status }
        );
      }

      const facilitatorResult = (await facilitatorResponse.json()) as {
        success?: boolean;
        isValid?: boolean;
        txHash?: string;
        transaction?: string;
        payer?: string;
        error?: string;
        message?: string;
      };

      console.log("0xGasless facilitator response:", facilitatorResult);

      // Check if payment was successful
      if (facilitatorResult.success || facilitatorResult.isValid) {
        // Extract transaction hash (might be in txHash or transaction field)
        const txHash = facilitatorResult.txHash ?? facilitatorResult.transaction;
        
        return NextResponse.json({
          success: true,
          isValid: true,
          payer: facilitatorResult.payer,
          txHash: txHash,
        });
      } else {
        return NextResponse.json(
          {
            error: "Payment verification failed",
            reason: facilitatorResult.error ?? facilitatorResult.message ?? "Unknown error from facilitator",
          },
          { status: 402 }
        );
      }
    } catch (facilitatorError) {
      console.error("Error communicating with 0xGasless facilitator:", facilitatorError);
      return NextResponse.json(
        {
          error: "Facilitator communication failed",
          reason: facilitatorError instanceof Error ? facilitatorError.message : "Unable to reach facilitator service",
        },
        { status: 500 }
      );
    }
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

