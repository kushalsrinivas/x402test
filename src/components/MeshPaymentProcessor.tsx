// Mesh Payment Processor Component
// Handles actual wallet connections and X402 payments for mesh distribution

'use client';

import { useEffect, useRef } from 'react';
import { BrowserProvider } from 'ethers';

// EIP-712 Domain for USDC
const EIP712_DOMAIN = {
  name: 'USD Coin',
  version: '2',
};

// EIP-712 Types for TransferWithAuthorization
const TRANSFER_WITH_AUTHORIZATION_TYPES = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
  ],
};

interface MeshPaymentProcessorProps {
  fromAddress: string;
  toAddress: string;
  token: string;
  amount: string;
  networkConfig: {
    chainId: number;
    name: string;
    rpcUrl: string;
    usdcAddress: string;
  };
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  onSigning: () => void;
}

export function MeshPaymentProcessor({
  fromAddress,
  toAddress,
  token,
  amount,
  networkConfig,
  onSuccess,
  onError,
  onSigning,
}: MeshPaymentProcessorProps) {
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    void processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function processPayment() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        onError('MetaMask is not installed');
        return;
      }

      // Connect to wallet
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Verify the connected wallet matches the sender
      if (userAddress.toLowerCase() !== fromAddress.toLowerCase()) {
        onError(`Wrong wallet connected. Expected ${fromAddress}, got ${userAddress}`);
        return;
      }

      // Check if on correct network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(networkConfig.chainId)) {
        try {
          await provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${networkConfig.chainId.toString(16)}` },
          ]);
        } catch (switchError: unknown) {
          if ((switchError as { code?: number })?.code === 4902) {
            await provider.send('wallet_addEthereumChain', [
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

      // Prepare payment details
      const amountFloat = parseFloat(amount);
      const valueInUSDC = Math.floor(amountFloat * 1_000_000); // USDC has 6 decimals

      const validAfter = Math.floor(Date.now() / 1000);
      const validBefore = validAfter + 3600; // Valid for 1 hour

      // Generate random nonce
      const nonceBuffer = new Uint8Array(32);
      crypto.getRandomValues(nonceBuffer);
      const nonce = '0x' + Array.from(nonceBuffer).map(b => b.toString(16).padStart(2, '0')).join('');

      // Create EIP-712 message
      const domain = {
        ...EIP712_DOMAIN,
        verifyingContract: networkConfig.usdcAddress,
        chainId: networkConfig.chainId,
      };

      const message = {
        from: fromAddress,
        to: toAddress,
        value: valueInUSDC,
        validAfter,
        validBefore,
        nonce,
      };

      onSigning();

      // Sign the message using EIP-712
      const signature = await signer.signTypedData(
        domain,
        TRANSFER_WITH_AUTHORIZATION_TYPES,
        message
      );

      // Parse signature
      const sig = signature.slice(2);
      const r = '0x' + sig.slice(0, 64);
      const s = '0x' + sig.slice(64, 128);
      const v = parseInt(sig.slice(128, 130), 16);

      // Prepare payment payload
      const paymentPayload = {
        from: fromAddress,
        to: toAddress,
        value: valueInUSDC.toString(),
        validAfter,
        validBefore,
        nonce,
        v,
        r,
        s,
      };

      // Send to X402 facilitator for processing
      const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL ?? 'https://x402.org/facilitator';
      const response = await fetch(facilitatorUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'processPayment',
          payload: paymentPayload,
        }),
      });

      if (!response.ok) {
        throw new Error('Facilitator processing failed');
      }

      const result = await response.json() as { txHash?: string; error?: string };
      
      if (result.txHash) {
        onSuccess(result.txHash);
      } else {
        throw new Error(result.error ?? 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Unknown error during payment');
      }
    }
  }

  return null; // This component doesn't render anything
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

