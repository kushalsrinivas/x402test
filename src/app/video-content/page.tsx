// Video Content Page - Protected Content

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VideoContentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-red-500"></div>
          <p className="text-white">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-16">
        <header className="mb-12 text-center">
          {/* Success badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 backdrop-blur-sm">
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
            <span className="text-lg font-semibold text-emerald-300">
              Payment Verified
            </span>
          </div>

          <h1 className="mb-4 bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text">
              Premium Content
            </span>
          </h1>

          <p className="text-xl text-gray-300">
            You&apos;ve successfully unlocked exclusive access
          </p>
        </header>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Video card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/20 to-red-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>

            <div className="relative p-2">
              <div className="overflow-hidden rounded-2xl bg-black">
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="relative p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Exclusive Video Content
              </h2>
              <p className="text-gray-300">
                Enjoy your premium content! This video is now unlocked thanks to
                your x402 payment.
              </p>
            </div>
          </div>

          {/* Info cards grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Payment success card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-emerald-300">
                    ✓ Access Granted
                  </h3>
                  <p className="text-sm text-emerald-200/80">
                    You paid <span className="font-semibold">$0.10 USDC</span>{" "}
                    using the x402 payment protocol on Avalanche Mainnet.
                  </p>
                </div>
              </div>
            </div>

            {/* How it worked card */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-white">
                    How It Worked
                  </h3>
                  <p className="text-sm text-gray-400">
                    You signed a gasless payment authorization, the x402 protocol
                    verified it, and granted instant access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits breakdown */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 backdrop-blur-xl">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Why x402 is Revolutionary
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">
                    Gasless Transactions
                  </h4>
                  <p className="text-sm text-gray-400">
                    No gas fees for users—powered by ERC-3009
                    TransferWithAuthorization
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <span className="text-2xl">🚫</span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">
                    No Accounts Needed
                  </h4>
                  <p className="text-sm text-gray-400">
                    No signups, passwords, or personal data required
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">
                    Blockchain Verified
                  </h4>
                  <p className="text-sm text-gray-400">
                    Payment settled on Avalanche for transparent verification
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">
                    Instant Access
                  </h4>
                  <p className="text-sm text-gray-400">
                    Pay and access immediately—no waiting for confirmations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <Link
            href="/"
            className="group/btn relative block overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-red-500/50"
          >
            <div className="flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 px-8 py-5 transition-all group-hover/btn:from-red-500 group-hover/btn:to-rose-500">
              <svg
                className="h-6 w-6 text-white transition-transform group-hover/btn:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              <span className="text-xl font-bold text-white">
                Return to Homepage
              </span>
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Learn more about{" "}
            <a
              href="https://www.x402.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 transition-colors hover:text-red-300"
            >
              x402 Payment Protocol
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
