'use client';

import { useAppSelector } from '@/store/hooks';
import { selectTokenIn, selectTokenOut } from '@/store/slices/swapSlice';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { isNonZero } from '@/lib/regex';
import { useGasPrice } from 'wagmi';
import useInputConrtoll from './hooks/useInputsControll';
import ReverseTokens from './ReverseButton';
import { calculateGasPriceInUSDC } from '../../../app/actions/utils';
import InputWithLoader from '@/components/common/InputWithLoader';
import useTokensBalance from './hooks/useTokenBalance';

const BALANCE_PLACEHOLDER = 'Choose token to see balance';

const SwapSection = () => {
  const tokenIn = useAppSelector(selectTokenIn);
  const tokenOut = useAppSelector(selectTokenOut);

  const { tokenInBalance, tokenOutBalance, refetchBalances } = useTokensBalance(
    tokenIn,
    tokenOut
  );
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
  } = useInputConrtoll({ tokenIn, tokenOut, refetchBalances });

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
        width: '80%',
        maxWidth: '800px',
        alignSelf: 'center',
        padding: 2,
        borderRadius: 3,
        border: '1px solid #FFA040',
      }}
    >
      <InputWithLoader
        inputLabel="From"
        isLoading={isPending && !isInput}
        inputProps={getTextFieldProps('amountIn')}
        helperText={{
          text:
            tokenIn && tokenInBalance.value
              ? `${tokenInBalance.value} ${tokenIn.symbol}`
              : BALANCE_PLACEHOLDER,
          loading: tokenInBalance.isLoading,
        }}
        endAdornmentContent={tokenIn?.symbol}
      />

      <ReverseTokens tokenIn={tokenIn} tokenOut={tokenOut} />

      <InputWithLoader
        inputLabel="To"
        isLoading={isPending && isInput}
        inputProps={getTextFieldProps('amountOut')}
        helperText={{
          text:
            tokenOut && tokenOutBalance.value
              ? `${tokenOutBalance.value} ${tokenOut.symbol}`
              : BALANCE_PLACEHOLDER,
          loading: tokenOutBalance.isLoading,
        }}
        endAdornmentContent={tokenOut?.symbol}
      />

      <Typography
        sx={{ textAlign: 'end', minHeight: '28px' }}
        variant="subtitle1"
      >
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
      <Typography sx={{ minHeight: '32px' }} variant="h6" color={status.type}>
        {status.message}
      </Typography>
    </Box>
  );
};

export default SwapSection;
