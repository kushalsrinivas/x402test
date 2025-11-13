"use client";

import { useState } from "react";

interface TransactionDetailsProps {
  transaction: {
    id: string;
    from: string;
    to: string;
    token: string;
    amount: string;
    txHash?: string;
    payer?: string;
    timestamp: number;
  };
  className?: string;
}

export function TransactionDetails({ 
  transaction, 
  className = "" 
}: TransactionDetailsProps) {
  const [copied, setCopied] = useState(false);

  const transactionData = {
    transactionId: transaction.id,
    from: transaction.from,
    to: transaction.to,
    token: transaction.token,
    amount: transaction.amount,
    txHash: transaction.txHash,
    payer: transaction.payer,
    timestamp: transaction.timestamp,
    date: new Date(transaction.timestamp).toISOString(),
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(transactionData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy transaction details:", err);
    }
  };

  return (
    <div className={`mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1 text-xs">
          <div className="font-semibold text-emerald-300">Transaction Details</div>
          
          {transaction.txHash && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Tx Hash:</span>
              <code className="flex-1 font-mono text-emerald-400">
                {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
              </code>
            </div>
          )}
          
          {transaction.payer && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Payer:</span>
              <code className="flex-1 font-mono text-emerald-400">
                {transaction.payer.slice(0, 6)}...{transaction.payer.slice(-4)}
              </code>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Amount:</span>
            <span className="text-emerald-400">${transaction.amount} {transaction.token}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400">To:</span>
            <code className="font-mono text-emerald-400">
              {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}
            </code>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className="shrink-0 rounded px-2 py-1 text-xs transition-colors hover:bg-emerald-500/20"
          title="Copy full transaction details"
        >
          {copied ? (
            <svg
              className="h-5 w-5 text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

