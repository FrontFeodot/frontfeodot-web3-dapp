'use server';

import { getPublicClient } from '@/lib/web3/clients';
import { Token } from '@/lib/web3/types/token.types';
import { Address, erc20Abi, formatEther } from 'viem';
import { getEthPrice } from './pricesActions';

export const isNativeTokenSymbol = async (token: string): Promise<boolean> =>
  token === 'ETH';

export const getBalance = async (
  token: Token,
  ownerAddress: Address
): Promise<bigint> => {
  const publicClient = getPublicClient();

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

export const isEnoughBalance = async (
  token: Token,
  amount: bigint,
  ownerAddress: Address
) => {
  const balance = await getBalance(token, ownerAddress);
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

export const getWrapperNativeTokenAddress = async (): Promise<Address> =>
  '0x4200000000000000000000000000000000000006';
