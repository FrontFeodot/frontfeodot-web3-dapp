const env = process.env.NODE_ENV;

export const NAV_ROUTES = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Transfer', href: '/transfer' },
  { name: 'History', href: '/history' },
  ...(env === 'development'
    ? [{ name: 'Get tokens', href: '/getTokens' }]
    : []),
];

export const TOKEN_ADDRESS_LIST: Record<string, string> = {
  ETH: '',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

export const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address, uint256) returns (bool)',
];
