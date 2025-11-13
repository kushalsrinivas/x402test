// API Route: /api/process-x402-payment
// Server-side proxy for X402 facilitator to avoid CORS issues

import { NextRequest, NextResponse } from "next/server";

interface PaymentPayload {
  from: string;
  to: string;
  value: string;
  validAfter: number;
  validBefore: number;
  nonce: string;
  v: number;
  r: string;
  s: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      payload: PaymentPayload;
    };

    const { payload } = body;

    // Validate payload
    if (!payload || !payload.from || !payload.to || !payload.value) {
      return NextResponse.json(
        { error: "Invalid payment payload" },
        { status: 400 }
      );
    }

    // Get facilitator URL from environment or use default
    const facilitatorUrl =
      process.env.NEXT_PUBLIC_FACILITATOR_URL ?? "https://x402.org/facilitator";

    console.log("Proxying payment to X402 facilitator:", {
      facilitatorUrl,
      from: payload.from,
      to: payload.to,
      value: payload.value,
    });

    // Make server-side request to X402 facilitator
    const response = await fetch(facilitatorUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "processPayment",
        payload: payload,
      }),
    });

    // Get response body
    const responseText = await response.text();
    
    console.log("X402 facilitator response:", {
      status: response.status,
      body: responseText.slice(0, 200), // Log first 200 chars
    });

    if (!response.ok) {
      console.error("Facilitator error:", response.status, responseText);
      return NextResponse.json(
        {
          error: `Facilitator returned ${response.status}: ${responseText || "Unknown error"}`,
        },
        { status: response.status }
      );
    }

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse facilitator response as JSON:", e);
      return NextResponse.json(
        {
          error: "Invalid response from facilitator",
          details: responseText.slice(0, 100),
        },
        { status: 502 }
      );
    }

    // Return the facilitator's response
    return NextResponse.json(result);
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

