import { encodeFunctionData, erc20Abi } from 'viem';

import { SwapPayload, SwapStatus } from './types/swap.types';
import { DefinedWalletClient } from './types/common.types';
import { getWalletClient } from './clients';
import { Dispatch, SetStateAction } from 'react';
import { getWrapperNativeTokenAddress } from '../../app/actions/utils';
import { SWAP_ROUTER_ADDRESS } from './contractAddresses';
import { SWAP_ABI } from './abi';
import { prepareSwapTransaction } from '../../app/actions/swapActions';

const wrapETH = async (
  amount: bigint,
  walletClient: DefinedWalletClient
): Promise<SwapStatus> => {
  try {
    const address = await getWrapperNativeTokenAddress();
    const tx = await walletClient.writeContract({
      address,
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
  } catch (err) {
    console.error('Error wrapping ETH:', err);
    return { message: 'Something went wrong', type: 'error' };
  }
};

const unWrapETH = async (
  amountIn: bigint,
  walletClient: DefinedWalletClient
): Promise<SwapStatus> => {
  try {
    const address = await getWrapperNativeTokenAddress();

    await walletClient.writeContract({
      address,
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
    const walletClient = getWalletClient();
    const { address: ownerAddress } = walletClient.account;

    setStatus({ message: 'Preparing transaction...', type: 'info' });

    const preparedTransaction = await prepareSwapTransaction({
      tokenIn,
      tokenOut,
      amountIn,
      ownerAddress,
    });

    console.log('preparedTransaction =>', preparedTransaction);

    if (preparedTransaction.type === 'Error') {
      setStatus({ message: preparedTransaction.message, type: 'error' });
      return;
    }

    const { txParams, approvalParams, isNativeIn, isNativeOut } =
      preparedTransaction;

    const isWethToEth = tokenIn.symbol === 'WETH' && isNativeOut;
    const isEthToWeth = isNativeIn && tokenOut.symbol === 'WETH';
    console.log('isWethToEth, isEthToWeth =>', isWethToEth, isEthToWeth);
    if (isWethToEth) {
      const result = await unWrapETH(amountIn, walletClient);
      return setStatus(result);
    }
    if (isEthToWeth) {
      const result = await wrapETH(amountIn, walletClient);
      return setStatus(result);
    }

    if (approvalParams) {
      setStatus({ message: 'Approving swap...', type: 'info' });
      await walletClient.writeContract({
        address: approvalParams.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: approvalParams.args,
      });
    }

    const DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 10 * 60);

    setStatus({
      message: 'Waiting for transaction confirmation by user...',
      type: 'info',
    });

    const params = {
      ...txParams,
      deadline: DEADLINE,
    };

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
      args: [params.amountOutMinimum, ownerAddress],
    });

    const callDataRefund = encodeFunctionData({
      abi: SWAP_ABI,
      functionName: 'refundETH',
      args: [],
    });

    await walletClient.writeContract({
      address: SWAP_ROUTER_ADDRESS,
      abi: SWAP_ABI,
      functionName: 'multicall',
      args: [DEADLINE, [callDataSwap, callDataUnwrap, callDataRefund]],
    });

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
