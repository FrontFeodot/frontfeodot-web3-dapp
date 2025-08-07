'use server';

import { parseEther, parseUnits } from 'viem';
import { getBalance, isNativeTokenSymbol } from './utils';
import {
  PreparedTransferTransaction,
  TransferTransactionError,
  TransferTransactionPrepare,
} from '@/lib/web3/types/transfer.types';

export const prepareTransferTransaction = async ({
  receiver,
  token,
  ownerAddress,
  amount,
}: TransferTransactionPrepare): Promise<
  PreparedTransferTransaction | TransferTransactionError
> => {
  try {
    const isNative = await isNativeTokenSymbol(token.symbol);

    const balance = await getBalance(token, ownerAddress);
    const value = isNative
      ? parseEther(amount)
      : parseUnits(amount, token.decimals);
    if (balance < value) {
      throw new Error(
        `Not enough balance: balance ${balance} < amount ${value}`
      );
    }

    return {
      type: 'Prepared',
      isNative,
      address: token.id,
      args: [receiver, value],
    };
  } catch (err) {
    console.error('Error transferring token:', err);
    if (err instanceof Error) return { type: 'Error', message: err.message };
    return err as TransferTransactionError;
  }
};
