'use client';

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { SelectTokenProps } from './types';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

const SelectToken = ({
  token,
  setToken,
  refetchRef,
  tokenList,
}: SelectTokenProps) => {
  const { address } = useAccount();
  const { data: accountBalance, refetch } = useBalance({
    address,
    ...(token.symbol !== 'ETH' ? { token: token.id } : {}),
  });

  useEffect(() => {
    if (!!refetch && refetchRef) {
      refetchRef.current = refetch;
    }
  }, [refetch, refetchRef]);

  const balance = accountBalance
    ? formatUnits(accountBalance?.value, accountBalance?.decimals)
    : 0;

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const token = tokenList.find((t) => t.symbol === event.target.value);
    if (!token) return;
    setToken(token);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}
    >
      <Box>
        <FormControl fullWidth>
          <InputLabel id="token_name_label">Token</InputLabel>
          <Select
            fullWidth
            labelId="token_name_label"
            id="token_name"
            value={token.symbol}
            label="Token"
            onChange={handleSelectChange}
          >
            {tokenList.map(({ symbol }) => (
              <MenuItem value={symbol} key={symbol}>
                {symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="h6">
        Balance: {balance || 0} {token.symbol}
      </Typography>
    </Box>
  );
};

export default SelectToken;
