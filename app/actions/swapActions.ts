'use server';

import { getPublicClient } from '@/lib/web3/clients';
import {
  PreparedSwapTransaction,
  PrepareSwapTransactionPayload,
  SwapPreparationResult,
} from '@/lib/web3/types/swap.types';
import { isEnoughBalance, isNativeTokenSymbol } from './utils';
import { quoteTokens } from './quoterActions';
import { SLIPPAGE_TOLERANCE } from '@/lib/constants';
import { erc20Abi } from 'viem';
import { SWAP_ROUTER_ADDRESS } from '@/lib/web3/contractAddresses';

export async function prepareSwapTransaction({
  tokenIn,
  tokenOut,
  amountIn,
  ownerAddress,
}: PrepareSwapTransactionPayload): Promise<SwapPreparationResult> {
  const isNativeIn = await isNativeTokenSymbol(tokenIn.symbol);
  const isNativeOut = await isNativeTokenSymbol(tokenOut.symbol);

  const publicClient = getPublicClient();

  try {
    if (!(await isEnoughBalance(tokenIn, amountIn, ownerAddress))) {
      return { type: 'Error', message: 'Not enough balance' };
    }

    const result: PreparedSwapTransaction = {
      type: 'Prepared',
      isNativeIn,
      isNativeOut,
    };

    const quotingResult = await quoteTokens({ tokenIn, tokenOut, amountIn });

    if (!quotingResult) {
      return { type: 'Error', message: 'No pools found' };
    }

    if (typeof quotingResult === 'bigint') {
      return result;
    }

    const amountOutMinimum =
      (quotingResult.amountOut * (10000n - SLIPPAGE_TOLERANCE)) / 10000n;

    const txParams = {
      tokenIn: tokenIn.id,
      tokenOut: tokenOut.id,
      fee: quotingResult.fee,
      recipient: isNativeOut ? SWAP_ROUTER_ADDRESS : ownerAddress,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96: 0,
    };

    let approvalParams: PreparedSwapTransaction['approvalParams'] | undefined =
      undefined;

    if (!isNativeIn) {
      const allowance = await publicClient.readContract({
        address: tokenIn.id,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [ownerAddress, SWAP_ROUTER_ADDRESS],
      });

      if (allowance < amountIn) {
        approvalParams = {
          address: tokenIn.id,
          args: [SWAP_ROUTER_ADDRESS, amountIn],
        };
      }
    }

    return {
      txParams,
      ...result,
      ...(approvalParams ? { approvalParams } : {}),
    };
  } catch (error) {
    console.error('Swap preparation failed:', error);
    return { type: 'Error', message: 'Failed to prepare transaction' };
  }
}
