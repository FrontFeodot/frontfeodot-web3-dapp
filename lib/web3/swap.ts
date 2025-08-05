import { encodeFunctionData, erc20Abi } from 'viem';
import { isEnoughBalance, isNativeTokenName } from './utils';
import {
  SLIPPAGE_TOLERANCE,
  SWAP_ABI,
  SWAP_ROUTER_ADDRESS,
  TOKEN_ADDRESS_LIST,
} from '../constants';
import { SwapPayload, SwapStatus } from './types/swap.types';
import { DefinedWalletClient } from './types';
import { getPublicClient, getWalletClient } from './clients';
import { Dispatch, SetStateAction } from 'react';
import { getQuotedTokens } from './quoter';

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
  { amountIn, tokenIn, tokenOut }: SwapPayload,
  setStatus: Dispatch<SetStateAction<SwapStatus>>
): Promise<void> => {
  try {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const { address: ownerAddress } = walletClient.account;

    const isNativeIn = isNativeTokenName(tokenIn.symbol);
    const isNativeOut = isNativeTokenName(tokenOut.symbol);

    const isWethToEth = tokenIn.symbol === 'WETH' && isNativeOut;
    const isEthToWeth = isNativeIn && tokenOut.symbol === 'WETH';

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

    const quotingParams = {
      tokenIn,
      tokenOut,
      amountIn,
    };
    setStatus({ message: 'Quoting swap...', type: 'info' });

    if (!isNativeIn) {
      setStatus({ message: 'Approving swap...', type: 'info' });
      const allowance = await publicClient.readContract({
        address: tokenIn.id,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [ownerAddress, SWAP_ROUTER_ADDRESS],
      });

      if (allowance < amountIn) {
        await walletClient.writeContract({
          address: tokenIn.id,
          abi: erc20Abi,
          functionName: 'approve',
          args: [SWAP_ROUTER_ADDRESS, amountIn],
        });
      }
    }
    const DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 10 * 60);

    const quotingResult = await getQuotedTokens(quotingParams);

    if (!quotingResult || !quotingResult.length) {
      setStatus({
        message: 'No pools found, please change tokens',
        type: 'error',
      });
      return;
    }

    const amountOutMin =
      (quotingResult[0].amountOut * (10000n - SLIPPAGE_TOLERANCE)) / 10000n;

    const params = {
      tokenIn: tokenIn.id,
      tokenOut: tokenOut.id,
      fee: quotingResult[0].fee,
      recipient: isNativeOut ? SWAP_ROUTER_ADDRESS : ownerAddress,
      deadline: DEADLINE,
      amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0,
    };
    console.log(params);

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
    });

    console.log('TX Swap hash:', tx);
    setStatus({ message: 'Successfully swapped', type: 'success' });
    setTimeout(() => setStatus({ message: '', type: 'info' }), 5000);
    return;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      const message = err.message.split('.')[0];
      return setStatus({ message, type: 'error' });
    }
    return setStatus({ message: 'Something went wrong', type: 'error' });
  }
};
