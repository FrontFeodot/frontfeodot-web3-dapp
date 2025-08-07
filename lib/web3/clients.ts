import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  PublicClient,
} from 'viem';
import { DefinedWalletClient } from './types/common.types';
import { getWagmiConfig, hardhatFork } from './wagmiConfig';
import { RPC_URL } from '../constants';
import { getAccount } from 'wagmi/actions';

let walletClient: DefinedWalletClient;
let publicClient: PublicClient;

export const getPublicClient = (): PublicClient => {
  if (!publicClient) {
    publicClient = createPublicClient({
      cacheTime: 20000,
      chain: hardhatFork, // should be changed after deploy
      transport: http(RPC_URL),
    });
  }
  return publicClient;
};

export const getWalletClient = (): DefinedWalletClient => {
  if (!walletClient) {
    const wagmiConfig = getWagmiConfig();
    const address = getAccount(wagmiConfig).address;

    if (!address) throw new Error('Address is not initialized');

    const currentChain = hardhatFork; // should be changed after deploy
    walletClient = createWalletClient({
      transport: custom(window.ethereum!),
      chain: currentChain,
      account: address,
    });
  }
  return walletClient;
};
