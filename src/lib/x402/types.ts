// x402 Payment Protocol Types

export interface PaymentDetails {
  maxAmountRequired: string;
  resource: string;
  description: string;
  payTo: string;
  asset: string;
  network: string;
}

export interface X402Response {
  statusCode: 402;
  paymentDetails: PaymentDetails;
}

export interface PaymentPayload {
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

export interface X402Config {
  walletAddress: string;
  price: string;
  network: string;
  facilitatorUrl?: string;
}

export interface PaymentVerificationResult {
  valid: boolean;
  message?: string;
  txHash?: string;
}

