import { Address } from 'viem';

export interface SwapArgs {
  tokenIn: Address;
  amountIn: bigint;
  tokenOut: Address;
  isNativeIn: boolean;
  isNativeOut: boolean;
}

export interface QuotingParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  fee: number;
  sqrtPriceLimitX96: bigint;
}

export interface PrepareSwapArgs {
  tokenInName: string;
  tokenOutName: string;
  amountInString: string;
}

export interface SwapStatus {
  message: string;
  type: 'success' | 'error' | 'info';
}
