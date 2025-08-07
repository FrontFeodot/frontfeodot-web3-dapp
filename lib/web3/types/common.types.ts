import { Account, Chain, GetBalanceErrorType, WalletClient } from 'viem';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Transport } from 'wagmi';

export type RefetchBalance = (options?: RefetchOptions) => Promise<
  QueryObserverResult<
    {
      decimals: number;
      formatted: string;
      symbol: string;
      value: bigint;
    },
    GetBalanceErrorType
  >
>;

export type DefinedWalletClient = WalletClient<Transport, Chain, Account>;
