import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { defineChain } from 'viem';

// only for development fork
export const hardhatFork = defineChain({
  id: 1337,
  name: 'Hardhat Fork',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

const config = createConfig({
  chains: [hardhatFork],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [hardhatFork.id]: http('http://127.0.0.1:8545'),
  },
});

export const getWagmiConfig = () => {
  return config;
};
