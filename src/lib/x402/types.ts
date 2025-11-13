// x402 Payment Protocol Types
// These types match the x402 v1 specification

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

// Legacy PaymentPayload format (old v,r,s format)
export interface LegacyPaymentPayload {
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

// x402 v1 PaymentPayload format (ExactEvmPayload)
export interface X402PaymentPayload {
  x402Version: 1;
  scheme: 'exact';
  network: string;
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      validAfter: string;
      validBefore: string;
      nonce: string;
    };
  };
}

// Union type for backwards compatibility
export type PaymentPayload = X402PaymentPayload | LegacyPaymentPayload;

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

