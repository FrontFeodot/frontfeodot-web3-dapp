import { Address } from 'viem';
import { Token } from './token.types';

export interface SwapPayload {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: bigint;
}

export interface QuoteExactOutputParams {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: bigint;
}

export interface QuoteResult {
  amountOut: bigint;
  fee: number;
}

export interface SwapStatus {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SwapTx {
  tokenIn: Address;
  tokenOut: Address;
  fee: number;
  recipient: Address;
  deadline: bigint;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96: number;
}

export interface PreparedSwapTransaction {
  type: 'Prepared';
  isNativeIn: boolean;
  isNativeOut: boolean;
  txParams?: Omit<SwapTx, 'deadline'>;
  nativeAmountOut?: bigint;
  approvalParams?: {
    address: Address;
    args: [Address, bigint];
  };
}

export interface PrepareSwapTransactionPayload {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: bigint;
  ownerAddress: Address;
}

export type SwapPreparationResult =
  | PreparedSwapTransaction
  | { type: 'Error'; message: string };
