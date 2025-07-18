'use client';

import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useActionState, useState } from 'react';
import SelectToken from './SelectToken';
import FormError from '../common/FormError';
import { FormValues, TransferActionState } from './types';
import { handleTransferSubmit } from './utils';

const TransferTokens = () => {
  const [tokenName, setTokenName] = useState('ETH');
  const [balance, setBalance] = useState('');
  const [success, setSuccess] = useState(false);

  const [formState, formAction, isPending] = useActionState<
    TransferActionState,
    FormData
  >(
    (prevState, formData) =>
      handleTransferSubmit(
        prevState,
        formData,
        tokenName,
        setBalance,
        setSuccess
      ),
    {
      receiver: '',
      amount: '',
      errors: {},
    }
  );

  const textFieldProps = (field: keyof FormValues): TextFieldProps => ({
    name: field as string,
    id: field as string,
    error: !!formState.errors?.[field],
    color: `${formState.errors?.[field] ? 'error' : 'primary'}`,
    fullWidth: true,
    required: true,
    defaultValue: formState.errors ? formState[field] : undefined,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="h6">Wallet address</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        action={formAction}
        component="form"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField {...textFieldProps('receiver')} />
          <FormError message={formState?.errors?.receiver} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6">Amount</Typography>
          <TextField {...textFieldProps('amount')} />

          <FormError message={formState?.errors?.amount} />
        </Box>

        <SelectToken
          balance={balance}
          setBalance={setBalance}
          tokenName={tokenName}
          setTokenName={setTokenName}
        />

        <FormError message={formState?.errors?.global} />
        {success && (
          <Typography color="success">
            Tokens transferred successfully
          </Typography>
        )}

        <Button type="submit" variant="contained" loading={isPending}>
          Transfer tokens
        </Button>
      </Box>
    </Box>
  );
};

export default TransferTokens;
