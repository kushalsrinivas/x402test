// X402 Payment Client Component
// Handles wallet connection and payment signing

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

interface X402PaymentClientProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  onStatusChange: (status: 'connecting' | 'signing' | 'processing') => void;
}

export function X402PaymentClient({
  onSuccess,
  onError,
  onStatusChange,
}: X402PaymentClientProps) {
  const hasAttemptedPayment = useRef(false);

  useEffect(() => {
    if (hasAttemptedPayment.current) return;
    hasAttemptedPayment.current = true;

    void initiatePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initiatePayment() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        onError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      onStatusChange('connecting');

      // Get payment info from server
      const paymentInfoResponse = await fetch('/api/payment-info');
      if (!paymentInfoResponse.ok) {
        const errorData = await paymentInfoResponse.json().catch(() => ({})) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to fetch payment information');
      }

      const paymentInfo = await paymentInfoResponse.json() as {
        walletAddress: string;
        paymentAmount: string;
        networkConfig: {
          chainId: number;
          name: string;
          rpcUrl: string;
          usdcAddress: string;
        };
      };
      const { walletAddress, paymentAmount, networkConfig } = paymentInfo;

      // Validate network configuration
      if (!networkConfig || !networkConfig.chainId) {
        throw new Error('Invalid network configuration received from server. Please check your environment variables.');
      }

      // Connect to wallet
      const provider = new BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Check if on correct network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(networkConfig.chainId)) {
        try {
          // Try to switch network
          await provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${networkConfig.chainId.toString(16)}` },
          ]);
        } catch (switchError: unknown) {
          // If the error is due to the network not being added, add it
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
      const amount = parseFloat(paymentAmount.replace('$', ''));
      const valueInUSDC = Math.floor(amount * 1_000_000); // USDC has 6 decimals

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
        from: userAddress,
        to: walletAddress,
        value: valueInUSDC,
        validAfter,
        validBefore,
        nonce,
      };

      onStatusChange('signing');

      // Sign the message using EIP-712
      const signature = await signer.signTypedData(
        domain,
        TRANSFER_WITH_AUTHORIZATION_TYPES,
        message
      );

      // Prepare payment payload in x402 v1 format
      // This follows the ExactEvmPayload schema from the x402 package
      const paymentPayload = {
        x402Version: 1,
        scheme: 'exact' as const,
        network: 'base-sepolia' as const, // Use the correct network identifier
        payload: {
          signature: signature, // Full signature string (0x...)
          authorization: {
            from: userAddress,
            to: walletAddress,
            value: valueInUSDC.toString(),
            validAfter: validAfter.toString(),
            validBefore: validBefore.toString(),
            nonce,
          },
        },
      };

      onStatusChange('processing');

      // Send payment to authenticate endpoint
      const authenticateResponse = await fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': JSON.stringify(paymentPayload),
        },
      });

      if (authenticateResponse.ok) {
        onSuccess();
      } else {
        const errorData = await authenticateResponse.json() as { error?: string };
        throw new Error(errorData.error ?? 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred during payment');
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

