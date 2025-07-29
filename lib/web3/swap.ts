import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import {
  getDecimals,
  getTokenAddress,
  isEnoughBalance,
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
  TOKEN_ADDRESS_LIST,
} from '../constants';
import type { PublicClient } from 'viem';
import {
  PrepareSwapArgs,
  QuotingParams,
  SwapArgs,
  SwapStatus,
} from './types/swap.types';
import { DefinedWalletClient } from './types';
import { getPublicClient, getWalletClient } from './clients';
import { Dispatch, SetStateAction } from 'react';

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

const wrapETH = async (
  amount: bigint,
  walletClient: DefinedWalletClient
): Promise<SwapStatus> => {
  try {
    const tx = await walletClient.writeContract({
      address: TOKEN_ADDRESS_LIST['WETH'],
      abi: [
        {
          inputs: [],
          name: 'deposit',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
      functionName: 'deposit',
      value: amount,
    });

    console.log('Wrap tx:', tx);
    return { message: 'Successfuly swapped', type: 'success' };
  } catch {
    return { message: 'Something went wrong', type: 'error' };
  }
};

const unWrapETH = async (
  amountIn: bigint,
  walletClient: DefinedWalletClient
): Promise<SwapStatus> => {
  try {
    await walletClient.writeContract({
      address: TOKEN_ADDRESS_LIST['WETH'],
      abi: [
        {
          inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'withdraw',
      args: [amountIn],
    });

    return { message: 'Successfuly swapped', type: 'success' };
  } catch (err) {
    console.log(err);
    return { message: 'Something went wrong', type: 'error' };
  }
};

export const swapTokenManager = async (
  { amountIn, tokenIn, tokenOut, isNativeIn, isNativeOut }: SwapArgs,
  setStatus: Dispatch<SetStateAction<SwapStatus>>
): Promise<void> => {
  try {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const { address: ownerAddress } = walletClient.account;

    const isWethToEth = tokenIn === TOKEN_ADDRESS_LIST['WETH'] && isNativeOut;
    const isEthToWeth = isNativeIn && tokenOut === TOKEN_ADDRESS_LIST['WETH'];

    if (!(await isEnoughBalance(tokenIn, amountIn))) {
      setStatus({ message: 'Not enough balance', type: 'error' });
      return;
    }

    if (isWethToEth) {
      const result = await unWrapETH(amountIn, walletClient);
      return setStatus(result);
    }
    if (isEthToWeth) {
      const result = await wrapETH(amountIn, walletClient);
      return setStatus(result);
    }

    const quotingParams: QuotingParams = {
      tokenIn,
      tokenOut,
      amountIn,
      fee: POOL_FEE,
      sqrtPriceLimitX96: 0n,
    };
    setStatus({ message: 'Quoting swap...', type: 'info' });

    const amountOutMin = await getQuotedAmountMin(quotingParams, publicClient);

    if (!isNativeIn) {
      setStatus({ message: 'Approving swap...', type: 'info' });
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
      recipient: isNativeOut ? SWAP_ROUTER_ADDRESS : ownerAddress,
      deadline: DEADLINE,
      amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0,
    };

    setStatus({
      message: 'Waiting for transaction confirmation by user...',
      type: 'info',
    });

    if (!isNativeOut) {
      const txSwap = await walletClient.writeContract({
        address: SWAP_ROUTER_ADDRESS,
        abi: SWAP_ABI,
        functionName: 'exactInputSingle',
        args: [params],
        value: isNativeIn ? amountIn : 0n,
      });
      console.log('TX Swap hash:', txSwap);
      return setStatus({ message: 'Successfully swapped', type: 'success' });
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

    const callDataRefund = encodeFunctionData({
      abi: SWAP_ABI,
      functionName: 'refundETH',
      args: [],
    });

    const tx = await walletClient.writeContract({
      address: SWAP_ROUTER_ADDRESS,
      abi: SWAP_ABI,
      functionName: 'multicall',
      args: [DEADLINE, [callDataSwap, callDataUnwrap, callDataRefund]],
      value: isNativeIn ? amountIn : 0n,
    });

    console.log('TX Swap hash:', tx);
    return setStatus({ message: 'Successfully swapped', type: 'success' });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      const message = err.message.split('.')[0];
      return setStatus({ message, type: 'error' });
    }
    return setStatus({ message: 'Something went wrong', type: 'error' });
  }
};
