import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import {
  getDecimals,
  getPublicClient,
  getTokenAddress,
  getWalletClient,
  isNativeTokenName,
} from './utils';
import {
  DEADLINE,
  POOL_FEE,
  QUOTER_ABI,
  QUOTER_ADDRESS,
  SLIPPAGE_TOLERANCE,
  SWAP_ABI,
  SWAP_ROUTER_ADDRESS,
} from '../constants';
import type { PublicClient } from 'viem';
import { PrepareSwapArgs, QuotingParams, SwapArgs } from './types/swap.types';

export const prepareSwap = async ({
  tokenInName,
  tokenOutName,
  amountInString,
}: PrepareSwapArgs): Promise<SwapArgs> => {
  const tokenIn = getTokenAddress(tokenInName);
  const tokenOut = getTokenAddress(tokenOutName);
  const decimals = await getDecimals(tokenIn);
  const amountIn = parseUnits(amountInString, decimals);

  const isNativeIn = isNativeTokenName(tokenInName);
  const isNativeOut = isNativeTokenName(tokenOutName);

  return { tokenIn, tokenOut, amountIn, isNativeIn, isNativeOut };
};

const getQuotedAmountMin = async (
  params: QuotingParams,
  publicClient: PublicClient
) => {
  const [quotedAmountOut] = await publicClient.readContract({
    address: QUOTER_ADDRESS,
    abi: QUOTER_ABI,
    functionName: 'quoteExactInputSingle',
    args: [params as never],
  });

  const amountOutMin =
    (quotedAmountOut * (10000n - SLIPPAGE_TOLERANCE)) / 10000n;

  return amountOutMin;
};

export const handleV3Swap = async ({
  amountIn,
  tokenIn,
  tokenOut,
  isNativeIn,
  isNativeOut,
}: SwapArgs) => {
  try {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const [ownerAddress] = await walletClient.getAddresses();

    const quotingParams: QuotingParams = {
      tokenIn,
      tokenOut,
      amountIn,
      fee: POOL_FEE,
      sqrtPriceLimitX96: 0n,
    };

    const amountOutMin = await getQuotedAmountMin(quotingParams, publicClient);

    if (!isNativeIn) {
      const allowance = await publicClient.readContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [ownerAddress, SWAP_ROUTER_ADDRESS],
      });

      if (allowance < amountIn) {
        await walletClient.writeContract({
          address: tokenIn,
          abi: erc20Abi,
          functionName: 'approve',
          args: [SWAP_ROUTER_ADDRESS, amountIn],
        });
      }
    }

    const params = {
      tokenIn,
      tokenOut,
      fee: POOL_FEE,
      recipient: ownerAddress,
      deadline: DEADLINE,
      amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0,
    };

    console.log('Sending swap transaction…');

    if (!isNativeOut) {
      const txSwap = await walletClient.writeContract({
        address: SWAP_ROUTER_ADDRESS,
        abi: SWAP_ABI,
        functionName: 'exactInputSingle',
        args: [params],
        value: isNativeIn ? amountIn : 0n,
      });
      console.log('TX Swap hash:', txSwap);

      return;
    }

    const callDataSwap = encodeFunctionData({
      abi: SWAP_ABI,
      functionName: 'exactInputSingle',
      args: [params],
    });
    const callDataUnwrap = encodeFunctionData({
      abi: SWAP_ABI,
      functionName: 'unwrapWETH9',
      args: [amountOutMin, ownerAddress],
    });

    const tx = await walletClient.writeContract({
      address: SWAP_ROUTER_ADDRESS,
      abi: SWAP_ABI,
      functionName: 'multicall',
      args: [[callDataSwap, callDataUnwrap]],
      value: isNativeIn ? amountIn : 0n,
    });

    console.log('TX Swap to NAtive token; hash:', tx);
  } catch (err) {
    console.error(err);
  }
};
