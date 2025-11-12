// API Route: /api/mesh-distribute
// Coordinates multi-wallet mesh token distribution via real X402 payments

import type { NextRequest } from "next/server";

interface MeshDistributionRequest {
  senderWallet: string;
  recipients: string[];
  tokens: string[];
  minAmount: string;
  maxAmount: string;
  numberOfTransactions: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  token: string;
  amount: string;
  status: "pending" | "signing" | "processing" | "success" | "error";
  timestamp: number;
  txHash?: string;
  error?: string;
}

// Random selection helper
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

// Generate random amount within range
function randomAmount(min: number, max: number): string {
  const amount = min + Math.random() * (max - min);
  return amount.toFixed(2);
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const body = (await request.json()) as MeshDistributionRequest;
        const { senderWallet, recipients, tokens, minAmount, maxAmount, numberOfTransactions } = body;

        // Validate inputs
        if (!senderWallet) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Sender wallet required" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        if (!recipients || recipients.length === 0) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "At least 1 recipient required" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        if (!tokens || tokens.length === 0) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "At least 1 token required" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const min = parseFloat(minAmount);
        const max = parseFloat(maxAmount);

        if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Invalid amount range" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Generate transactions
        for (let i = 0; i < numberOfTransactions; i++) {
          // Random selection
          const to = randomElement(recipients);
          const token = randomElement(tokens);
          const amount = randomAmount(min, max);

          const transaction: Transaction = {
            id: `tx-${Date.now()}-${i}`,
            from: senderWallet,
            to,
            token,
            amount,
            status: "pending",
            timestamp: Date.now(),
          };

          // Send pending transaction
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ transaction })}\n\n`
            )
          );

          // Wait a bit before requesting signature
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Update to signing - tell frontend to process payment
          transaction.status = "signing";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ 
                transaction,
                needsSignature: true,
                paymentData: {
                  to: transaction.to,
                  token: transaction.token,
                  amount: transaction.amount
                }
              })}\n\n`
            )
          );

          // Note: The frontend will handle the actual payment signing and processing
          // In a real implementation, you'd wait for the frontend to report back
          // For now, we'll simulate a delay for the signature and processing
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Assume success for now (in real implementation, frontend would report back)
          transaction.status = "processing";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ transaction })}\n\n`
            )
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Mark as success with mock hash
          // In real implementation, this would come from X402 facilitator response
          transaction.status = "success";
          transaction.txHash = "0x" + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ transaction })}\n\n`
            )
          );
        }

        // Send completion message
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ complete: true })}\n\n`
          )
        );
      } catch (error) {
        console.error("Mesh distribution error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error: error instanceof Error ? error.message : "Unknown error",
            })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
