'use client';

import { swapTokenManager, prepareSwap } from '@/lib/web3/swap';
import { SwapStatus } from '@/lib/web3/types/swap.types';
import { useAppSelector } from '@/store/hooks';
import {
  selectTokenInName,
  selectTokenOutName,
} from '@/store/slices/swapSlice';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const SwapSection = () => {
  const [status, setStatus] = useState<SwapStatus>({
    message: '',
    type: 'info',
  });
  const [amountInString, setAmountInString] = useState('');
  const tokenInName = useAppSelector(selectTokenInName);
  const tokenOutName = useAppSelector(selectTokenOutName);

  const handleSwap = async () => {
    setStatus({ message: 'Preparing swap...', type: 'info' });
    const swapParams = await prepareSwap({
      tokenInName,
      tokenOutName,
      amountInString,
    });
    await swapTokenManager(swapParams, setStatus);
  };

  const textFieldProps = (
    field: 'amountIn' | 'amountOut'
  ): OutlinedInputProps => ({
    name: field as string,
    id: field as string,
    disabled: !tokenInName || !tokenOutName,
    error: false /* !!formState.errors?.[field] */,
    color: 'primary' /* `${formState.errors?.[field] ? 'error' : 'primary'}` */,
    fullWidth: true,
    required: true,
    placeholder: '0',
  });

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '50%' }}
    >
      <FormControl variant="outlined">
        <OutlinedInput
          value={amountInString}
          onChange={(e) => setAmountInString(e.target.value)}
          {...textFieldProps('amountIn')}
          endAdornment={
            <InputAdornment position="end">{tokenInName}</InputAdornment>
          }
          inputProps={{
            'aria-label': 'amountIn',
          }}
        />
      </FormControl>
      <FormControl variant="outlined">
        <OutlinedInput
          {...textFieldProps('amountOut')}
          disabled
          endAdornment={
            <InputAdornment position="end">{tokenOutName}</InputAdornment>
          }
          inputProps={{
            'aria-label': 'amountOut',
          }}
        />
      </FormControl>
      <Button onClick={handleSwap} variant="contained">
        Swap
      </Button>
      <Typography variant="h6" color={status.type}>
        {status.message}
      </Typography>
    </Box>
  );
};

export default SwapSection;
