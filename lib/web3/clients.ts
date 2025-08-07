import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  PublicClient,
} from 'viem';
import { DefinedWalletClient } from './types/common.types';
import { getWagmiConfig } from './wagmiConfig';
import { RPC_URL } from '../constants';
import { getAccount } from 'wagmi/actions';
import { base } from 'viem/chains';

let walletClient: DefinedWalletClient;
let publicClient: PublicClient;

export const getPublicClient = (): PublicClient => {
  if (!publicClient) {
    publicClient = createPublicClient({
      cacheTime: 20000,
      chain: base,
      transport: http(RPC_URL),
    }) as PublicClient;
  }
  return publicClient;
};

export const getWalletClient = (): DefinedWalletClient => {
  if (!walletClient) {
    const wagmiConfig = getWagmiConfig();
    const address = getAccount(wagmiConfig).address;

    if (!address) throw new Error('Address is not initialized');

    walletClient = createWalletClient({
      transport: custom(window.ethereum!),
      chain: base,
      account: address,
    });
  }
  return walletClient;
};
