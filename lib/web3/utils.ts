import {
  Address,
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  http,
  PublicClient,
} from 'viem';
import { getWagmiConfig, hardhatFork } from './wagmiConfig';
import { getAccount } from '@wagmi/core';
import { DefinedWalletClient } from './types';
import { TOKEN_ADDRESS_LIST } from '../constants';

export const getRPC_URL = () =>
  process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';

export const isNativeTokenName = (token: string) => token === 'ETH';

export const getCurrentChain = (): Chain => {
  return hardhatFork;
};

export const getPublicClient = (): PublicClient => {
  return createPublicClient({
    chain: hardhatFork,
    transport: http(getRPC_URL()),
  });
};

export const getWalletClient = (): DefinedWalletClient => {
  const wagmiConfig = getWagmiConfig();
  const address = getAccount(wagmiConfig).address;
  if (!address) throw new Error('Address is not initialized');

  const currentChain = getCurrentChain();
  const walletClient = createWalletClient({
    transport: custom(window.ethereum!),
    chain: currentChain,
    account: address,
  });
  return walletClient;
};

export const getDecimals = async (tokenAddress: Address): Promise<number> => {
  const publicClient = getPublicClient();
  const decimals = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  });
  return decimals;
};

export const getTokenAddress = (tokenName: string): Address => {
  if (isNativeTokenName(tokenName)) {
    return TOKEN_ADDRESS_LIST['WETH'];
  }
  return TOKEN_ADDRESS_LIST[tokenName];
};
