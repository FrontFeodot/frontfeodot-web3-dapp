'use server';

import { getPublicClient } from '@/lib/web3/clients';
import { CHAINLINK_ETH_USD_ABI } from '@/lib/web3/abi';
import { CHAINLINK_ETH_USD_ADDRESS } from '@/lib/web3/contractAddresses';
import { formatUnits } from 'viem';

export const getEthPrice = async (): Promise<number> => {
  const publicClient = getPublicClient();
  const decimals = await publicClient.readContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: CHAINLINK_ETH_USD_ABI,
    functionName: 'decimals',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, usdcPrice] = await publicClient.readContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: CHAINLINK_ETH_USD_ABI,
    functionName: 'latestRoundData',
  });
  return Number(formatUnits(usdcPrice, decimals));
};
