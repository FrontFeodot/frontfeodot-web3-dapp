import { RefetchBalance } from '@/lib/web3/types/common.types';
import { Token } from '@/lib/web3/types/token.types';
import { RefObject } from 'react';

export interface FormValues extends Partial<FormData> {
  receiver: string;
  amount: string;
}

export interface FormErrorValues extends Partial<FormValues> {
  global?: string;
}

export interface TransferActionState extends FormValues {
  errors: FormErrorValues | null;
}

export interface SelectTokenProps {
  token: Token;
  setToken: (token: Token) => void;
  refetchRef: RefObject<RefetchBalance | null>;
  tokenList: Token[];
}
