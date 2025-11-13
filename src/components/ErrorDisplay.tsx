"use client";

import { useState } from "react";

interface ErrorDisplayProps {
  error: string | object;
  className?: string;
  showCopyButton?: boolean;
}

export function ErrorDisplay({
  error,
  className = "",
  showCopyButton = true,
}: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const errorText =
    typeof error === "string" ? error : JSON.stringify(error, null, 2);
  const displayText =
    typeof error === "string" ? error : "See full error details";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error:", err);
    }
  };

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="flex-1 text-xs opacity-75">Error: {displayText}</div>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="shrink-0 rounded px-2 py-1 text-xs transition-colors hover:bg-white/10"
          title="Copy error details"
        >
          {copied ? (
            <svg
              className="h-4 w-4 text-emerald-400"
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
              className="h-4 w-4"
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
      )}
    </div>
  );
}
