'use client';

import TokenLogo from '@/components/common/TokenLogo';
import { Token } from '@/lib/web3/types/token.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTokenIn,
  selectTokenOut,
  setTokenIn,
  setTokenOut,
} from '@/store/slices/swapSlice';
import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';

interface TokenListItemProps {
  token: Token;
}

const TokenListItem = ({ token }: TokenListItemProps) => {
  const { id, symbol } = token;

  const dispatch = useAppDispatch();
  const tokenIn = useAppSelector(selectTokenIn);
  const tokenOut = useAppSelector(selectTokenOut);

  const handleAddToken = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      dispatch(setTokenIn(token));
      if (symbol === tokenOut?.symbol) {
        dispatch(setTokenOut(tokenIn));
      }
    }

    if (direction === 'out') {
      dispatch(setTokenOut(token));
      if (symbol === tokenIn?.symbol) {
        dispatch(setTokenIn(tokenOut));
      }
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <TokenLogo id={id} symbol={symbol} />
        <Typography variant="h6">{symbol}</Typography>
      </Box>

      <ButtonGroup variant="contained">
        <Button
          sx={{
            px: {
              xs: 1,
              sm: 3,
            },
            py: {
              xs: 1,
            },
          }}
          disabled={symbol === tokenIn?.symbol}
          onClick={() => handleAddToken('in')}
        >
          <Typography color="textPrimary"> Swap from</Typography>
        </Button>
        <Button
          sx={{
            px: {
              xs: 1,
              sm: 3,
            },
            py: {
              xs: 1,
            },
          }}
          disabled={symbol === tokenOut?.symbol}
          onClick={() => handleAddToken('out')}
        >
          <Typography color="textPrimary"> Swap to</Typography>
        </Button>
      </ButtonGroup>
    </Paper>
  );
};

export default TokenListItem;
