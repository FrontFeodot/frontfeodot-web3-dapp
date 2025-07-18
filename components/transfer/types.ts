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
  balance: string;
  setBalance: (balance: string) => void;
  tokenName: string;
  setTokenName: (tokenName: string) => void;
}
