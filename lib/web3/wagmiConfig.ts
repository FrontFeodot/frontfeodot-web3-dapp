import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { defineChain } from 'viem';
import { RPC_URL } from '../constants';

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
      http: [RPC_URL],
    },
    public: {
      http: [RPC_URL],
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
    [hardhatFork.id]: http(RPC_URL),
  },
});

export const getWagmiConfig = () => {
  return config;
};
