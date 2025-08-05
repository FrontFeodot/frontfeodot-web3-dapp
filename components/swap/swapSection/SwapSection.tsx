'use client';

import { useAppSelector } from '@/store/hooks';
import { selectTokenIn, selectTokenOut } from '@/store/slices/swapSlice';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { isNonZero } from '@/lib/regex';
import { calculateGasPriceInUSDC } from '@/lib/web3/utils';
import { useGasPrice } from 'wagmi';
import Loader from '@/components/common/Loader';
import useInputConrtoll from './hooks/useInputsControll';
import { ReverseTokens } from './ReverseButtton';

const SwapSection = () => {
  const tokenIn = useAppSelector(selectTokenIn);
  const tokenOut = useAppSelector(selectTokenOut);

  const [gasEstimate, setGasEstimate] = useState('');
  const { data: gasPrice } = useGasPrice({
    query: {
      refetchInterval: 60_000,
    },
  });

  const {
    amountInString,
    amountOutString,
    isPending,
    isInput,
    status,
    getTextFieldProps,
    handleSwap,
  } = useInputConrtoll({ tokenIn, tokenOut });

  useEffect(() => {
    if (tokenIn && tokenOut && gasPrice) {
      calculateGasPriceInUSDC(gasPrice).then((data) => {
        setGasEstimate(Number(data).toFixed(2).toString());
      });
    }
  }, [gasPrice, tokenIn, tokenOut]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '50%',
        alignSelf: 'center',
        padding: 2,
      }}
    >
      <FormControl variant="outlined">
        <InputLabel>From</InputLabel>
        <OutlinedInput
          {...getTextFieldProps('amountIn')}
          endAdornment={
            <InputAdornment position="end">{tokenIn?.symbol}</InputAdornment>
          }
          inputProps={{ 'aria-label': 'amountIn' }}
        />
        {isPending && !isInput && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 1,
              pointerEvents: 'none',
            }}
          >
            <Loader />
          </Box>
        )}
      </FormControl>
      {tokenIn && tokenOut && (
        <ReverseTokens tokenIn={tokenIn} tokenOut={tokenOut} />
      )}
      <FormControl variant="outlined">
        <InputLabel>To</InputLabel>

        <OutlinedInput
          {...getTextFieldProps('amountOut')}
          inputProps={{ 'aria-label': 'amountOut' }}
        />
        {isPending && isInput && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.4)', // можно убрать или настроить
              borderRadius: 1,
              pointerEvents: 'none',
            }}
          >
            <Loader />
          </Box>
        )}
      </FormControl>
      <Typography sx={{ minHeight: '28px' }} variant="subtitle1">
        {amountInString &&
          amountOutString &&
          `Gas estimate: ${gasEstimate === '0.00' ? '< $0.01' : `$${gasEstimate}`}`}
      </Typography>
      <Button
        disabled={
          !tokenIn || !tokenOut || isPending || !isNonZero(amountInString)
        }
        onClick={handleSwap}
        variant="contained"
      >
        Swap
      </Button>
      <Typography variant="h6" color={status.type}>
        {status.message}
      </Typography>
    </Box>
  );
};

export default SwapSection;
