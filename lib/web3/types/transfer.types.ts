import { Address } from 'viem';
import { Token } from './token.types';

export interface TransferParams {
  receiver: Address;
  amount: string;
  token: Token;
}

export interface TransferTransactionPrepare extends TransferParams {
  ownerAddress: Address;
}

export interface PreparedTransferTransaction {
  type: 'Prepared';
  isNative: boolean;
  address: Address;
  args: [Address, bigint];
}

export interface TransferTransactionError {
  type: 'Error';
  message: string;
}
