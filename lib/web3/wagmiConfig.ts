import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { RPC_URL } from '../constants';
import { base } from 'viem/chains';

const config = createConfig({
  chains: [base],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http(RPC_URL),
  },
});

export const getWagmiConfig = () => {
  return config;
};
