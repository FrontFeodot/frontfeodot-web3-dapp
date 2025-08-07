export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';

export const SLIPPAGE_TOLERANCE = 50n;
export const FEE = 3000;
export const FEE_LIST = ['100', '500', '3000', '10000'];

export const NAV_ROUTES = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Transfer', href: '/transfer' },
  ...(process.env.NODE_ENV === 'development'
    ? [{ name: 'Get tokens', href: '/getTokens' }]
    : []),
];
