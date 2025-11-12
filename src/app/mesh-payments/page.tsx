"use client";

import { useState } from "react";
import Link from "next/link";
import { BrowserProvider } from "ethers";

interface Recipient {
  id: string;
  address: string;
}

interface Token {
  symbol: string;
  name: string;
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

export default function MeshPaymentsPage() {
  const [connectedWallet, setConnectedWallet] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", address: "" },
    { id: "2", address: "" },
  ]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["USDC"]);
  const [minAmount, setMinAmount] = useState<string>("0.01");
  const [maxAmount, setMaxAmount] = useState<string>("0.10");
  const [numberOfTransactions, setNumberOfTransactions] = useState<number>(5);
  const [isRunning, setIsRunning] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Available tokens
  const availableTokens: Token[] = [
    { symbol: "USDC", name: "USD Coin" },
  ];

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install MetaMask to continue.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setConnectedWallet(address);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert(error instanceof Error ? error.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet("");
  };

  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now().toString(), address: "" }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((r) => r.id !== id));
    }
  };

  const updateRecipientAddress = (id: string, address: string) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, address } : r))
    );
  };

  const toggleToken = (symbol: string) => {
    if (selectedTokens.includes(symbol)) {
      if (selectedTokens.length > 1) {
        setSelectedTokens(selectedTokens.filter((t) => t !== symbol));
      }
    } else {
      setSelectedTokens([...selectedTokens, symbol]);
    }
  };

  // EIP-712 Domain and Types for USDC
  const EIP712_DOMAIN = {
    name: "USD Coin",
    version: "2",
  };

  const TRANSFER_WITH_AUTHORIZATION_TYPES = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  async function processRealPayment(
    to: string,
    token: string,
    amount: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not installed");
      }

      // Get payment info from server
      const paymentInfoResponse = await fetch("/api/payment-info");
      if (!paymentInfoResponse.ok) {
        throw new Error("Failed to fetch payment configuration");
      }

      const paymentInfo = (await paymentInfoResponse.json()) as {
        walletAddress: string;
        paymentAmount: string;
        networkConfig: {
          chainId: number;
          name: string;
          rpcUrl: string;
          usdcAddress: string;
        };
      };

      const { networkConfig } = paymentInfo;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Verify connected wallet matches
      if (userAddress.toLowerCase() !== connectedWallet.toLowerCase()) {
        throw new Error("Wallet mismatch - please reconnect");
      }

      // Check network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(networkConfig.chainId)) {
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: `0x${networkConfig.chainId.toString(16)}` },
          ]);
        } catch (switchError: unknown) {
          if ((switchError as { code?: number })?.code === 4902) {
            await provider.send("wallet_addEthereumChain", [
              {
                chainId: `0x${networkConfig.chainId.toString(16)}`,
                chainName: networkConfig.name,
                rpcUrls: [networkConfig.rpcUrl],
              },
            ]);
          } else {
            throw switchError;
          }
        }
      }

      // Prepare payment
      const amountFloat = parseFloat(amount);
      const valueInUSDC = Math.floor(amountFloat * 1_000_000); // USDC has 6 decimals

      const validAfter = Math.floor(Date.now() / 1000);
      const validBefore = validAfter + 3600;

      // Generate nonce
      const nonceBuffer = new Uint8Array(32);
      crypto.getRandomValues(nonceBuffer);
      const nonce =
        "0x" +
        Array.from(nonceBuffer)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      // Create EIP-712 message
      const domain = {
        ...EIP712_DOMAIN,
        verifyingContract: networkConfig.usdcAddress,
        chainId: networkConfig.chainId,
      };

      const message = {
        from: userAddress,
        to: to,
        value: valueInUSDC,
        validAfter,
        validBefore,
        nonce,
      };

      // Sign the payment
      const signature = await signer.signTypedData(
        domain,
        TRANSFER_WITH_AUTHORIZATION_TYPES,
        message
      );

      // Parse signature
      const sig = signature.slice(2);
      const r = "0x" + sig.slice(0, 64);
      const s = "0x" + sig.slice(64, 128);
      const v = parseInt(sig.slice(128, 130), 16);

      // Prepare payload for X402
      const paymentPayload = {
        from: userAddress,
        to: to,
        value: valueInUSDC.toString(),
        validAfter,
        validBefore,
        nonce,
        v,
        r,
        s,
      };

      // Send to X402 facilitator
      const facilitatorUrl =
        process.env.NEXT_PUBLIC_FACILITATOR_URL ?? "https://x402.org/facilitator";
      
      console.log("Sending payment to X402 facilitator:", {
        facilitatorUrl,
        from: userAddress,
        to,
        amount,
        token,
      });

      const response = await fetch(facilitatorUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "processPayment",
          payload: paymentPayload,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Facilitator error:", response.status, errorText);
        throw new Error(
          `Facilitator returned ${response.status}: ${errorText || "Unknown error"}`
        );
      }

      const result = (await response.json()) as { 
        txHash?: string; 
        error?: string;
        valid?: boolean;
        message?: string;
      };

      console.log("X402 facilitator response:", result);

      if (result.txHash || result.valid) {
        return { 
          success: true, 
          txHash: result.txHash || "0x" + "pending".padEnd(64, "0")
        };
      } else {
        throw new Error(
          result.error || result.message || "Payment verification failed"
        );
      }
    } catch (error) {
      console.error("Real payment error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  const validateInputs = (): string | null => {
    // Check wallet is connected
    if (!connectedWallet) {
      return "Please connect your wallet first";
    }

    // Check all recipients have addresses
    const emptyRecipients = recipients.filter((r) => !r.address.trim());
    if (emptyRecipients.length > 0) {
      return "All recipient addresses must be filled";
    }

    // Validate recipient addresses
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    const invalidRecipients = recipients.filter(
      (r) => !ethAddressRegex.exec(r.address)
    );
    if (invalidRecipients.length > 0) {
      return "All recipient addresses must be valid Ethereum addresses";
    }

    // Check for duplicate recipients
    const uniqueAddresses = new Set(recipients.map((r) => r.address.toLowerCase()));
    if (uniqueAddresses.size !== recipients.length) {
      return "Recipient addresses must be unique";
    }

    // Check sender is not in recipients
    if (recipients.some((r) => r.address.toLowerCase() === connectedWallet.toLowerCase())) {
      return "Your wallet cannot be a recipient";
    }

    // Validate amounts
    const min = parseFloat(minAmount);
    const max = parseFloat(maxAmount);
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
      return "Amount range must be positive numbers";
    }
    if (min > max) {
      return "Minimum amount cannot be greater than maximum amount";
    }

    // Validate number of transactions
    if (numberOfTransactions < 1 || numberOfTransactions > 100) {
      return "Number of transactions must be between 1 and 100";
    }

    return null;
  };

  const startMeshDistribution = async () => {
    const validationError = validateInputs();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsRunning(true);
    setTransactions([]);

    try {
      const response = await fetch("/api/mesh-distribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderWallet: connectedWallet,
          recipients: recipients.map((r) => r.address),
          tokens: selectedTokens,
          minAmount,
          maxAmount,
          numberOfTransactions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start mesh distribution");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      // Read streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6)) as { 
              transaction?: Transaction;
              needsSignature?: boolean;
              paymentData?: {
                to: string;
                token: string;
                amount: string;
              };
            };
            
            if (data.transaction) {
              // Update existing transaction or add new one
              setTransactions((prev) => {
                const existingIndex = prev.findIndex(t => t.id === data.transaction!.id);
                if (existingIndex >= 0) {
                  // Update existing transaction
                  const updated = [...prev];
                  updated[existingIndex] = data.transaction!;
                  return updated;
                } else {
                  // Add new transaction
                  return [...prev, data.transaction!];
                }
              });
            }
            
            // If signature needed, process real payment
            if (data.needsSignature && data.paymentData && data.transaction) {
              const txId = data.transaction.id;
              
              // Update to signing status
              setTransactions((prev) =>
                prev.map((t) =>
                  t.id === txId ? { ...t, status: "signing" } : t
                )
              );

              // Process the real payment
              const result = await processRealPayment(
                data.paymentData.to,
                data.paymentData.token,
                data.paymentData.amount
              );

              // Update based on result
              if (result.success) {
                setTransactions((prev) =>
                  prev.map((t) =>
                    t.id === txId
                      ? { ...t, status: "success", txHash: result.txHash }
                      : t
                  )
                );
              } else {
                setTransactions((prev) =>
                  prev.map((t) =>
                    t.id === txId
                      ? { ...t, status: "error", error: result.error }
                      : t
                  )
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Mesh distribution error:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "error":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      case "processing":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "processing":
        return (
          <svg
            className="h-5 w-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const successCount = transactions.filter((t) => t.status === "success").length;
  const errorCount = transactions.filter((t) => t.status === "error").length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-transparent"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-red-400"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          <div className="mb-4 inline-block rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 px-6 py-2 backdrop-blur-sm">
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-sm font-semibold tracking-wider text-transparent uppercase">
              Powered by X402 Protocol
            </span>
          </div>

          <h1 className="mb-4 bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Multi-Wallet Mesh
            <br />
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text">
              Token Distribution
            </span>
          </h1>

          <p className="max-w-3xl text-xl text-gray-300">
            Create a dynamic transaction network where all wallets exchange tokens
            with each other randomly, demonstrating X402&apos;s peer-to-peer capabilities.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Configuration
          </h2>

          {/* Wallet Connection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-white">
              Your Wallet (Sender)
            </label>
            {!connectedWallet ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting || isRunning}
                className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white transition-all hover:from-red-400 hover:to-rose-400 disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect MetaMask"}
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <span className="flex-1 font-mono text-sm text-emerald-300">
                  {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  disabled={isRunning}
                  className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Recipients Section */}
              <div className="mb-6">
                <label className="mb-3 flex items-center justify-between text-sm font-semibold text-white">
                  <span>Recipients (minimum 1)</span>
                  <button
                    onClick={addRecipient}
                    disabled={isRunning}
                    className="rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1 text-xs font-bold text-white transition-all hover:from-red-400 hover:to-rose-400 disabled:opacity-50"
                  >
                    + Add Recipient
                  </button>
                </label>
                <div className="space-y-3">
                  {recipients.map((recipient, index) => (
                    <div key={recipient.id} className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={recipient.address}
                          onChange={(e) =>
                            updateRecipientAddress(recipient.id, e.target.value)
                          }
                          disabled={isRunning}
                          placeholder={`Recipient ${index + 1} address (0x...)`}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                        />
                      </div>
                      {recipients.length > 1 && (
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          disabled={isRunning}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-red-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tokens Section */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-white">
                  Token Selection
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableTokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => toggleToken(token.symbol)}
                      disabled={isRunning}
                      className={`rounded-lg border px-4 py-3 font-semibold transition-all disabled:opacity-50 ${
                        selectedTokens.includes(token.symbol)
                          ? "border-red-500/50 bg-red-500/20 text-red-300"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-red-500/30 hover:bg-white/10"
                      }`}
                    >
                      {token.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Range */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Min Amount ($)
                  </label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    disabled={isRunning}
                    step="0.01"
                    min="0.01"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Max Amount ($)
                  </label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    disabled={isRunning}
                    step="0.01"
                    min="0.01"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Number of Transactions */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-white">
                  Number of Transactions
                </label>
                <input
                  type="number"
                  value={numberOfTransactions}
                  onChange={(e) =>
                    setNumberOfTransactions(parseInt(e.target.value) || 1)
                  }
                  disabled={isRunning}
                  min="1"
                  max="100"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                />
              </div>

              {/* Start Button */}
              <button
                onClick={startMeshDistribution}
                disabled={isRunning}
                className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-red-500/50 disabled:opacity-50"
              >
                <div className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 px-8 py-5 transition-all group-hover/btn:from-red-500 group-hover/btn:to-rose-500">
                  {isRunning ? (
                    <>
                      <svg
                        className="h-6 w-6 animate-spin text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-xl font-bold text-white">
                        Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-white">
                        Start Mesh Distribution
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Stats */}
            {transactions.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-4 backdrop-blur-xl">
                  <div className="text-3xl font-bold text-white">
                    {transactions.length}
                  </div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-xl">
                  <div className="text-3xl font-bold text-emerald-400">
                    {successCount}
                  </div>
                  <div className="text-sm text-emerald-300">Success</div>
                </div>
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-xl">
                  <div className="text-3xl font-bold text-red-400">
                    {errorCount}
                  </div>
                  <div className="text-sm text-red-300">Failed</div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Log */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Transaction Network
            </h2>

            {transactions.length === 0 ? (
              <div className="flex h-96 flex-col items-center justify-center text-gray-400">
                <svg
                  className="mb-4 h-16 w-16 text-gray-600"
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
                <p className="text-center">
                  Configure wallets and click Start to begin mesh distribution
                </p>
              </div>
            ) : (
              <div className="max-h-[600px] space-y-3 overflow-y-auto">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={`rounded-xl border p-4 transition-all ${getStatusColor(tx.status)}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <span className="font-semibold capitalize">
                          {tx.status}
                        </span>
                      </div>
                      <span className="text-xs opacity-75">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        <span className="font-mono text-xs">
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="font-semibold">{tx.token}</span>
                        <span>${tx.amount}</span>
                      </div>
                      {tx.txHash && (
                        <div className="mt-2 font-mono text-xs opacity-75">
                          Tx: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                        </div>
                      )}
                      {tx.error && (
                        <div className="mt-2 text-xs opacity-75">
                          Error: {tx.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <h3 className="mb-4 text-xl font-bold text-white">How It Works</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="mb-2 text-red-400">1. Connect Wallet</div>
              <p className="text-sm text-gray-400">
                Connect your MetaMask wallet - this will be the sender for all transactions
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="mb-2 text-red-400">2. Random Selection</div>
              <p className="text-sm text-gray-400">
                System randomly selects recipients and generates amounts
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="mb-2 text-red-400">3. Sign Transactions</div>
              <p className="text-sm text-gray-400">
                MetaMask will prompt you to sign each transaction (gasless!)
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="mb-2 text-red-400">4. X402 Processing</div>
              <p className="text-sm text-gray-400">
                X402 facilitator processes payments on-chain and returns tx hash
              </p>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-emerald-400"
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
              <div>
                <h4 className="font-semibold text-emerald-300 mb-1">
                  ✓ Real Blockchain Transactions
                </h4>
                <p className="text-sm text-emerald-200/80 leading-relaxed">
                  This feature uses actual X402 protocol for gasless USDC transfers on Avalanche. 
                  You&apos;ll sign real EIP-712 messages and transactions will be processed on-chain.
                  Make sure you have sufficient USDC balance!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}


