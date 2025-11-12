// Homepage - x402 Video Paywall Demo

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-transparent"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-16">
        <header className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 px-6 py-2 backdrop-blur-sm">
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-sm font-semibold tracking-wider text-transparent uppercase">
              Powered by x402 Protocol
            </span>
          </div>

          <h1 className="mb-6 bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
            Crypto Paywall
            <br />
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text">
              Made Simple
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
            Access premium content with instant crypto payments. No accounts, no
            friction—just pay and watch.
          </p>
        </header>

        <div className="mx-auto max-w-3xl">
          {/* Main card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-red-500/30 hover:shadow-red-500/10 sm:p-12">
            {/* Glow effect */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>

            <div className="relative">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span className="text-sm font-semibold text-emerald-300">
                  Premium Content
                </span>
              </div>

              <h2 className="mb-4 text-4xl font-bold text-white">
                Exclusive Video Access
              </h2>

              <p className="mb-8 text-xl text-gray-300">
                Unlock premium video content for just{" "}
                <span className="font-bold text-red-400">$0.10 USDC</span>
              </p>

              {/* Features grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/10">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
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
                  <h3 className="mb-2 font-bold text-white">Instant Access</h3>
                  <p className="text-sm text-gray-400">
                    Pay with crypto and get immediate access—no waiting, no
                    hassle
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/10">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-bold text-white">Gasless Payment</h3>
                  <p className="text-sm text-gray-400">
                    Sign once, no gas fees—powered by ERC-3009 authorization
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/10">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
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
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-bold text-white">No Accounts</h3>
                  <p className="text-sm text-gray-400">
                    No signups, no personal data—just your wallet and crypto
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/10">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-bold text-white">Avalanche Fast</h3>
                  <p className="text-sm text-gray-400">
                    Built on Avalanche for lightning-fast, low-cost transactions
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/authenticate"
                className="group/btn relative block w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-red-500/50"
              >
                <div className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 px-8 py-5 transition-all group-hover/btn:from-red-500 group-hover/btn:to-rose-500">
                  <span className="text-xl font-bold text-white">
                    Pay $0.10 to Unlock
                  </span>
                  <svg
                    className="h-6 w-6 text-white transition-transform group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>

              {/* Info footer */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secured by Avalanche • Powered by USDC</span>
              </div>
            </div>
          </div>
          {/* AI Chat card */}
          <div className="group relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-red-500/30 hover:shadow-red-500/10 sm:p-12">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-rose-400"></div>
                <span className="text-sm font-semibold text-rose-300">
                  AI Feature
                </span>
              </div>

              <h2 className="mb-4 text-4xl font-bold text-white">
                AI Chat Access
              </h2>
              <p className="mb-8 text-xl text-gray-300">
                Unlock an AI chat experience for just{" "}
                <span className="font-bold text-red-400">$0.10 USDC</span>
              </p>

              <Link
                href="/chat-authenticate"
                className="group/btn relative block w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-red-500/50"
              >
                <div className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 px-8 py-5 transition-all group-hover/btn:from-red-500 group-hover/btn:to-rose-500">
                  <span className="text-xl font-bold text-white">
                    Pay $0.10 to Chat
                  </span>
                  <svg
                    className="h-6 w-6 text-white transition-transform group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Mesh Payments card */}
          <div className="group relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-red-500/30 hover:shadow-red-500/10 sm:p-12">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
                <span className="text-sm font-semibold text-purple-300">
                  Advanced Feature
                </span>
              </div>

              <h2 className="mb-4 text-4xl font-bold text-white">
                Multi-Recipient Distribution
              </h2>
              <p className="mb-8 text-xl text-gray-300">
                Send USDC to multiple wallets with real X402 gasless transactions
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-2 font-semibold text-white">🔀 Random Distribution</div>
                  <p className="text-sm text-gray-400">
                    Automatically send random amounts to multiple recipients
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-2 font-semibold text-white">⚡ Real Transactions</div>
                  <p className="text-sm text-gray-400">
                    Actual blockchain payments via X402 facilitator
                  </p>
                </div>
              </div>

              <Link
                href="/mesh-payments"
                className="group/btn relative block w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-purple-500/50"
              >
                <div className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-5 transition-all group-hover/btn:from-purple-500 group-hover/btn:to-violet-500">
                  <span className="text-xl font-bold text-white">
                    Try Multi-Send Payments
                  </span>
                  <svg
                    className="h-6 w-6 text-white transition-transform group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-6 text-sm text-gray-400">
            <a
              href="https://www.x402.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-red-400"
            >
              x402 Protocol
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://www.avax.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-red-400"
            >
              Avalanche
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://core.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-red-400"
            >
              Core Wallet
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Built with ❤️ using the x402 Payment Protocol
          </p>
        </footer>
      </div>
    </main>
  );
}
