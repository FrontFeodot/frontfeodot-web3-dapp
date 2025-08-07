import { Address, erc20Abi, isAddress } from 'viem';
import { DefinedWalletClient } from './types/common.types';
import { getPublicClient, getWalletClient } from './clients';
import { prepareTransferTransaction } from '../../app/actions/transferActions';
import { TransferParams } from './types/transfer.types';

export const transferToWallet = async ({
  receiver,
  amount,
  token,
}: TransferParams): Promise<string | Error> => {
  try {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const isValidAddress = isAddress(receiver);

    if (!isValidAddress) throw new Error('Invalid address');
    const [sender] = await walletClient.getAddresses();

    const preparedTransaction = await prepareTransferTransaction({
      receiver,
      token,
      ownerAddress: sender,
      amount,
    });

    if (preparedTransaction.type === 'Error') {
      return preparedTransaction.message;
    }

    const { isNative, address, args } = preparedTransaction;
    let response: Address | Error;

    if (isNative) {
      response = await transferNative(args, walletClient);
    } else {
      response = await transferERC_20(args, address, walletClient);
    }

    if (response instanceof Error) throw response;

    await publicClient.waitForTransactionReceipt({
      hash: response,
    });
    return 'Transfer successful';
  } catch (error) {
    console.error('transfer error:', error);
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};

const transferNative = async (
  args: [Address, bigint],
  walletClient: DefinedWalletClient
): Promise<Address | Error> => {
  try {
    return await walletClient.sendTransaction({
      to: args[0],
      value: args[1],
    });
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};

const transferERC_20 = async (
  args: [Address, bigint],
  tokenAddress: Address,
  walletClient: DefinedWalletClient
): Promise<Address | Error> => {
  try {
    return await walletClient.writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'transfer',
      args,
    });
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};
