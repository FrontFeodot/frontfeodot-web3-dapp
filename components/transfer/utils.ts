import { transferToWallet } from '@/lib/web3/transfer';
import { FormErrorValues, FormValues, TransferActionState } from './types';
import { getBalance } from '@/lib/web3/balance';
import { Dispatch, SetStateAction } from 'react';

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
  tokenName: string,
  setBalance: Dispatch<SetStateAction<string>>,
  setSuccess: Dispatch<SetStateAction<boolean>>
): Promise<TransferActionState> => {
  const receiver = String(formData.get('receiver') ?? '').trim();
  const amount = String(formData.get('amount') ?? '').trim();
  console.log('handleTransferSubmit', receiver, amount);
  const validationErrors: FormErrorValues = validate({ amount, receiver });

  if (Object.keys(validationErrors).length) {
    return { receiver, amount, errors: validationErrors };
  } else {
    const response = await transferToWallet(receiver, amount, tokenName);
    if (response instanceof Error) {
      console.log(
        (response as unknown as { message: string; code: string | number }).code
      );
      return {
        ...prevState,
        receiver,
        amount,
        errors: { global: response.message },
      };
    }
    const newBalance = await getBalance(tokenName);
    setBalance(newBalance);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
    return { ...prevState, errors: null };
  }
};
