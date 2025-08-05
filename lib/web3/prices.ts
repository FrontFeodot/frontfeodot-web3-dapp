import { formatUnits } from 'viem';
import { CHAINLINK_ETH_USD_ABI } from '../constants';
import { getPublicClient } from './clients';

export const getEthPrice = async (): Promise<number> => {
  const publicClient = getPublicClient();
  const decimals = await publicClient.readContract({
    address: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    abi: CHAINLINK_ETH_USD_ABI,
    functionName: 'decimals',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, usdcPrice] = await publicClient.readContract({
    address: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    abi: CHAINLINK_ETH_USD_ABI,
    functionName: 'latestRoundData',
  });
  return Number(formatUnits(usdcPrice, decimals));
};
