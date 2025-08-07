import { transferToWallet } from '@/lib/web3/transfer';
import { FormErrorValues, FormValues, TransferActionState } from './types';
import { Dispatch, SetStateAction } from 'react';
import { RefetchBalance } from '@/lib/web3/types/common.types';
import { Address } from 'viem';
import { Token } from '@/lib/web3/types/token.types';

const validate = ({ amount, receiver }: FormValues): FormErrorValues => {
  const newErrors: { amount?: string; receiver?: string } = {};
  if (!amount.trim()) {
    newErrors.amount = 'Amount field is required';
  }
  if (!receiver.trim()) {
    newErrors.receiver = 'Receiver field is required';
  }
  return newErrors;
};

export const handleTransferSubmit = async (
  prevState: TransferActionState,
  formData: FormData,
  token: Token,
  setSuccess: Dispatch<SetStateAction<boolean>>,
  refetcFunc?: RefetchBalance | null
): Promise<TransferActionState> => {
  const receiver = String(formData.get('receiver') ?? '').trim();
  const amount = String(formData.get('amount') ?? '').trim();
  const validationErrors: FormErrorValues = validate({ amount, receiver });

  if (Object.keys(validationErrors).length) {
    return { receiver, amount, errors: validationErrors };
  } else {
    const response = await transferToWallet({
      receiver: receiver as Address,
      amount,
      token,
    });
    if (response instanceof Error) {
      return {
        ...prevState,
        receiver,
        amount,
        errors: { global: response.message.split('.')[0] },
      };
    }
    if (refetcFunc) {
      refetcFunc();
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
    return { ...prevState, errors: null };
  }
};
