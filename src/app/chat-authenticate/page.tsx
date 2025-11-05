// Authentication Page - Gated access for Chat

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X402PaymentClient } from "~/components/X402PaymentClient";

export default function ChatAuthenticatePage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "connecting" | "signing" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setPaymentStatus("connecting");
  }, []);

  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
    setTimeout(() => {
      router.push("/chat");
    }, 1500);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus("error");
    setErrorMessage(error);
  };

  const handleStatusChange = (
    status: "connecting" | "signing" | "processing",
  ) => {
    setPaymentStatus(status);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 px-6 py-2 backdrop-blur-sm">
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-sm font-semibold tracking-wider text-transparent uppercase">
              x402 Payment
            </span>
          </div>

          <h1 className="mb-4 bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-5xl font-black tracking-tight text-transparent">
            {paymentStatus === "success" && "Payment Successful!"}
            {paymentStatus === "error" && "Payment Failed"}
            {paymentStatus !== "success" &&
              paymentStatus !== "error" &&
              "Processing Payment"}
          </h1>

          <p className="text-lg text-gray-300">
            {paymentStatus === "connecting" && "Connecting to your wallet..."}
            {paymentStatus === "signing" &&
              "Please sign the payment authorization..."}
            {paymentStatus === "processing" && "Verifying your payment..."}
            {paymentStatus === "success" && "Redirecting to chat..."}
            {paymentStatus === "error" && "Something went wrong"}
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          {paymentStatus !== "error" ? (
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center">
                {paymentStatus === "success" ? (
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/50">
                    <svg
                      className="h-12 w-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="relative mb-6 h-24 w-24">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-red-500"></div>
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20"></div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xl font-semibold text-white">
                    {paymentStatus === "connecting" && "Connecting to Wallet"}
                    {paymentStatus === "signing" && "Awaiting Signature"}
                    {paymentStatus === "processing" && "Verifying Payment"}
                    {paymentStatus === "success" && "Payment Confirmed!"}
                  </p>

                  <p className="mt-2 text-gray-400">
                    {paymentStatus === "connecting" &&
                      "Opening MetaMask extension..."}
                    {paymentStatus === "signing" &&
                      "Please sign the message in your wallet"}
                    {paymentStatus === "processing" &&
                      "Confirming with x402 protocol..."}
                    {paymentStatus === "success" &&
                      "Granting access to AI Chat"}
                  </p>
                </div>
              </div>

              {paymentStatus === "signing" && (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-300">
                        ⚡ Gasless Transaction
                      </p>
                      <p className="mt-1 text-sm text-yellow-200/80">
                        You&apos;re signing a payment authorization. No gas fees
                        required—this is powered by ERC-3009!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-emerald-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-300">
                        ✓ Payment Verified
                      </p>
                      <p className="mt-1 text-sm text-emerald-200/80">
                        Your payment has been confirmed. Redirecting you to
                        Chat...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-gray-500">
                Please do not close this window
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
                  <svg
                    className="h-12 w-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                <p className="font-semibold text-red-300">Error:</p>
                <p className="mt-1 text-sm text-red-200/80">{errorMessage}</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                <p className="mb-3 font-semibold text-white">
                  Common solutions:
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>
                      Ensure your wallet is connected and on the right network
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>Have enough USDC to cover the payment</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>Refresh and try connecting again</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => router.push("/")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:border-red-500/30 hover:bg-white/10"
              >
                Return to Homepage
              </button>
            </div>
          )}
        </div>

        {paymentStatus !== "error" && paymentStatus !== "success" && (
          <X402PaymentClient
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </main>
  );
}
