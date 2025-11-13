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
    const facilitatorBaseUrl = process.env.FACILITATOR_URL ?? 'https://x402.0xgasless.com';
    // Remove trailing slash if present
    const baseUrl = facilitatorBaseUrl.endsWith('/') 
      ? facilitatorBaseUrl.slice(0, -1) 
      : facilitatorBaseUrl;
    
    console.log("Using 0xGasless facilitator:", baseUrl);

    try {
      // Step 1: Verify the payment with 0xGasless
      console.log("Step 1: Verifying payment...");
      const verifyUrl = `${baseUrl}/verify`;
      
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentPayload: payload,
          paymentRequirements: paymentRequirements,
        }),
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error("0xGasless verification error:", {
          status: verifyResponse.status,
          statusText: verifyResponse.statusText,
          body: errorText,
        });

        return NextResponse.json(
          {
            error: "Payment verification failed",
            reason: `0xGasless verify returned ${verifyResponse.status}: ${errorText}`,
          },
          { status: verifyResponse.status }
        );
      }

      const verifyResult = (await verifyResponse.json()) as {
        isValid?: boolean;
        payer?: string;
        invalidReason?: string;
        error?: string;
      };

      console.log("0xGasless verify response:", verifyResult);

      if (!verifyResult.isValid) {
        return NextResponse.json(
          {
            error: "Payment verification failed",
            reason: verifyResult.invalidReason ?? verifyResult.error ?? "Payment signature invalid",
          },
          { status: 402 }
        );
      }

      // Step 2: Settle the payment with 0xGasless
      console.log("Step 2: Settling payment on-chain...");
      const settleUrl = `${baseUrl}/settle`;

      const settleResponse = await fetch(settleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentPayload: payload,
          paymentRequirements: paymentRequirements,
        }),
      });

      if (!settleResponse.ok) {
        const errorText = await settleResponse.text();
        console.error("0xGasless settlement error:", {
          status: settleResponse.status,
          statusText: settleResponse.statusText,
          body: errorText,
        });

        return NextResponse.json(
          {
            error: "Payment settlement failed",
            reason: `0xGasless settle returned ${settleResponse.status}: ${errorText}`,
          },
          { status: settleResponse.status }
        );
      }

      const settleResult = (await settleResponse.json()) as {
        success?: boolean;
        transaction?: string;
        txHash?: string;
        error?: string;
        errorReason?: string;
      };

      console.log("0xGasless settle response:", settleResult);

      if (settleResult.success && (settleResult.transaction || settleResult.txHash)) {
        // Extract transaction hash
        const txHash = settleResult.transaction ?? settleResult.txHash;
        
        return NextResponse.json({
          success: true,
          isValid: true,
          payer: verifyResult.payer,
          txHash: txHash,
        });
      } else {
        return NextResponse.json(
          {
            error: "Payment settlement failed",
            reason: settleResult.errorReason ?? settleResult.error ?? "Failed to submit transaction on-chain",
          },
          { status: 500 }
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

