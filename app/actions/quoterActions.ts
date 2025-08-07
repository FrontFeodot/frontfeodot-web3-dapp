'use server';

import { QUOTER_ABI, UNISWAP_FACTORY_ABI } from '@/lib/web3/abi';
import {
  QuoteExactOutputParams,
  QuoteResult,
  SwapPayload,
} from '@/lib/web3/types/swap.types';
import {
  QUOTER_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
} from '@/lib/web3/contractAddresses';
import { getPublicClient } from '@/lib/web3/clients';
import { FEE_LIST } from '@/lib/constants';

export const quoteTokens = async (
  params: SwapPayload
): Promise<bigint | QuoteResult | undefined> => {
  try {
    if (params.tokenIn.id === params.tokenOut.id) {
      return params.amountIn;
    }

    const quotedTokens = await getQuotedTokens(params);

    if (!quotedTokens.length) {
      console.log('No pool found');
      return;
    }

    return quotedTokens[0];
  } catch (e) {
    console.error(e);
    return;
  }
};

export const getQuotedTokens = async (
  params: SwapPayload
): Promise<{ amountOut: bigint; fee: number }[]> => {
  const publicClient = getPublicClient();

  const quotePromises = FEE_LIST.map(async (fee) => {
    try {
      const poolAddress = await publicClient.readContract({
        address: UNISWAP_FACTORY_ADDRESS,
        abi: UNISWAP_FACTORY_ABI,
        functionName: 'getPool',
        args: [params.tokenIn.id, params.tokenOut.id, fee],
      });

      if (
        !poolAddress ||
        poolAddress === '0x0000000000000000000000000000000000000000'
      ) {
        return null;
      }
      const [amountOut] = await publicClient.readContract({
        address: QUOTER_ADDRESS,
        abi: QUOTER_ABI,
        functionName: 'quoteExactInputSingle',
        args: [
          {
            tokenIn: params.tokenIn.id,
            tokenOut: params.tokenOut.id,
            amountIn: params.amountIn,
            fee: Number(fee),
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      if (!amountOut) {
        return;
      }

      return { amountOut, fee: Number(fee) };
    } catch (error) {
      console.log('error in cycle', error);
      if ((error as { name: string }).name === 'AbortError') {
        console.log(`Quote request for fee ${fee} was aborted.`);
        return;
      }
      console.error(`Error fetching quote for fee ${fee}:`, error);
      return;
    }
  });

  const results = await Promise.allSettled(quotePromises);

  const successfulQuotes = results
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<{ amountOut: bigint; fee: number }> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);
  console.log('successfulQuotes', successfulQuotes);
  return successfulQuotes.sort((a, b) => (b.amountOut > a.amountOut ? 1 : -1));
};

export const quoteExactOutput = async (
  params: QuoteExactOutputParams
): Promise<bigint | undefined> => {
  try {
    if (params.tokenIn.id === params.tokenOut.id) {
      return params.amountOut;
    }

    const quotedTokens = await getQuotedTokensReverse(params);

    if (!quotedTokens.length) {
      console.log('No pool found for reverse quote');
      return;
    }

    return quotedTokens[0].amountIn;
  } catch (e) {
    console.error(e);
    return;
  }
};

const getQuotedTokensReverse = async (
  params: QuoteExactOutputParams
): Promise<{ amountIn: bigint; fee: number }[]> => {
  const publicClient = getPublicClient();

  const quotePromises = FEE_LIST.map(async (fee) => {
    try {
      const poolAddress = await publicClient.readContract({
        address: UNISWAP_FACTORY_ADDRESS,
        abi: UNISWAP_FACTORY_ABI,
        functionName: 'getPool',
        args: [params.tokenIn.id, params.tokenOut.id, fee],
      });

      if (
        !poolAddress ||
        poolAddress === '0x0000000000000000000000000000000000000000'
      ) {
        return null;
      }

      const [amountIn] = await publicClient.readContract({
        address: QUOTER_ADDRESS,
        abi: QUOTER_ABI,
        functionName: 'quoteExactOutputSingle',
        args: [
          {
            tokenIn: params.tokenIn.id,
            tokenOut: params.tokenOut.id,
            amount: params.amountOut,
            fee: Number(fee),
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      if (!amountIn) {
        return null;
      }

      return { amountIn, fee: Number(fee) };
    } catch (error) {
      console.error(`Error fetching reverse quote for fee ${fee}:`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(quotePromises);

  const successfulQuotes = results
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<{ amountIn: bigint; fee: number }> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);

  return successfulQuotes.sort((a, b) => (a.amountIn < b.amountIn ? -1 : 1));
};
