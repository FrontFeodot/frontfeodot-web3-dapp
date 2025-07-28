import { TokenName } from '@/lib/constants';
import { RefetchBalance } from '@/lib/web3/types';
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
  tokenName: string;
  setTokenName: (tokenName: TokenName) => void;
  refetchRef: RefObject<RefetchBalance | null>;
}
