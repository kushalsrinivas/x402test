// x402 Payment Protocol Constants

export const NETWORKS = {
  'avalanche-fuji': {
    name: 'Avalanche Fuji',
    chainId: 43113,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    usdcAddress: '0x5425890298aed601595a70AB815c96711a31Bc65', // USDC on Avalanche Fuji
  },
  'avalanche-mainnet': {
    name: 'Avalanche',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    usdcAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC on Avalanche C-Chain
  },
  'ethereum-mainnet': {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
  },
} as const;

export type NetworkName = keyof typeof NETWORKS;

export const DEFAULT_FACILITATOR_URL = 'https://x402.org/facilitator';

export const PAYMENT_HEADERS = {
  PAYMENT: 'X-PAYMENT',
  PAYMENT_REQUIRED: 'WWW-Authenticate',
} as const;

export const HTTP_STATUS = {
  PAYMENT_REQUIRED: 402,
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ERC-3009 TransferWithAuthorization domain separator
export const EIP712_DOMAIN = {
  name: 'USD Coin',
  version: '2',
} as const;

export const TRANSFER_WITH_AUTHORIZATION_TYPEHASH = 
  '0x7c7c6cdb67a18743f49ec6fa9b35f50d52ed05cbed4cc592e13b44501c1a2267';

