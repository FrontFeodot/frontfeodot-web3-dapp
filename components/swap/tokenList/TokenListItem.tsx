'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTokenInName,
  selectTokenOutName,
  setTokenInName,
  setTokenOutName,
} from '@/store/slices/swapSlice';
import { Button, ButtonGroup, Paper, Typography } from '@mui/material';

interface TokenListItemProps {
  token: string;
}

const TokenListItem = ({ token }: TokenListItemProps) => {
  const dispatch = useAppDispatch();
  const tokenInName = useAppSelector(selectTokenInName);
  const tokenOutName = useAppSelector(selectTokenOutName);

  const handleAddToken = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      dispatch(setTokenInName(token));
      if (token === tokenOutName) {
        dispatch(setTokenOutName(tokenInName));
      }
    }

    if (direction === 'out') {
      dispatch(setTokenOutName(token));
      if (token === tokenInName) {
        dispatch(setTokenInName(tokenOutName));
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
      <Typography variant="h6">{token}</Typography>
      <ButtonGroup variant="contained">
        <Button
          disabled={token === tokenInName}
          onClick={() => handleAddToken('in')}
        >
          <Typography color="textPrimary"> Swap from</Typography>
        </Button>
        <Button
          disabled={token === tokenOutName}
          onClick={() => handleAddToken('out')}
        >
          <Typography color="textPrimary"> Swap to</Typography>
        </Button>
      </ButtonGroup>
    </Paper>
  );
};

export default TokenListItem;
