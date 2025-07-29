import { Address, Chain, erc20Abi } from 'viem';
import { getWagmiConfig, hardhatFork } from './wagmiConfig';
import { getAccount } from '@wagmi/core';
import { TOKEN_ADDRESS_LIST } from '../constants';
import { getPublicClient } from './clients';

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

export const getBalance = async ({
  tokenName,
  tokenAddress,
}: {
  tokenName?: string;
  tokenAddress?: Address;
}): Promise<bigint> => {
  const publicClient = getPublicClient();
  const wagmiConfig = getWagmiConfig();
  const ownerAddress = getAccount(wagmiConfig).address;
  const address = tokenName
    ? getTokenAddress(tokenName)
    : (tokenAddress as Address);
  console.log('address, tokenAddress', ownerAddress, tokenAddress);
  if (!ownerAddress) throw new Error('Address is not initialized');

  if (tokenName === 'ETH') {
    return await publicClient.getBalance({
      address: ownerAddress,
    });
  }
  return await publicClient.readContract({
    address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [ownerAddress],
  });
};

export const isEnoughBalance = async (
  tokenAddress: Address,
  amount: bigint
) => {
  const balance = await getBalance({ tokenAddress });
  console.log('balance, amount', balance > amount);
  return balance > amount;
};
