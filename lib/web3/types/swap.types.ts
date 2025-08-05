import { Dispatch, SetStateAction } from 'react';
import { Token } from './token.types';

export interface SwapPayload {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: bigint;
  signal?: AbortSignal;
}

export interface QuoteExactOutputParams {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: bigint;
  signal: AbortSignal;
}

export interface SwapStatus {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface QuotingHandlers {
  setAmountInString: Dispatch<SetStateAction<string>>;
  setAmountOutString: Dispatch<SetStateAction<string>>;
  setIsPending: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<SwapStatus>>;
}

export type SetQuotedData = QuotingHandlers & SwapPayload & { field: string };
