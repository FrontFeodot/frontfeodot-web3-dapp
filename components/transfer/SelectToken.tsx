'use client';

import { TOKEN_ADDRESS_LIST } from '@/lib/constants';
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
  tokenName,
  setTokenName,
  refetchRef,
}: SelectTokenProps) => {
  const { address } = useAccount();
  const { data: accountBalance, refetch } = useBalance({
    address,
    ...(tokenName !== 'ETH' ? { token: TOKEN_ADDRESS_LIST[tokenName] } : {}),
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
    setTokenName(event.target.value);
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
            value={tokenName}
            label="Token"
            onChange={handleSelectChange}
          >
            {Object.keys(TOKEN_ADDRESS_LIST).map((token) => (
              <MenuItem value={token} key={token}>
                {token}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="h6">
        Balance: {balance || 0} {tokenName}
      </Typography>
    </Box>
  );
};

export default SelectToken;
