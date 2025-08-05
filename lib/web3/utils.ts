import { Address, Chain, erc20Abi, formatEther } from 'viem';
import { getWagmiConfig, hardhatFork } from './wagmiConfig';
import { getAccount } from '@wagmi/core';
import { TOKEN_ADDRESS_LIST } from '../constants';
import { getPublicClient } from './clients';
import { getEthPrice } from './prices';
import { Token } from './types/token.types';

export const isNativeTokenName = (token: string) => token === 'ETH';

export const getCurrentChain = (): Chain => {
  return hardhatFork;
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

export const getBalance = async (token: Token): Promise<bigint> => {
  const publicClient = getPublicClient();
  const wagmiConfig = getWagmiConfig();
  const ownerAddress = getAccount(wagmiConfig).address;

  if (!ownerAddress) throw new Error('Address is not initialized');

  if (token.symbol === 'ETH') {
    return await publicClient.getBalance({
      address: ownerAddress,
    });
  }
  return await publicClient.readContract({
    address: token.id,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [ownerAddress],
  });
};

export const isEnoughBalance = async (token: Token, amount: bigint) => {
  const balance = await getBalance(token);
  return balance > amount;
};

export const calculateGasPriceInUSDC = async (
  gasPriceInWei: bigint
): Promise<string> => {
  const gasPriceInETH = Number(formatEther(gasPriceInWei));

  const usdcPerETH = await getEthPrice();

  const gasPriceInUSD = gasPriceInETH * usdcPerETH;
  return gasPriceInUSD.toString();
};

export const getWrapperNativeTokenAddress = (): Address =>
  '0x4200000000000000000000000000000000000006';
