'use client';

import { TOKEN_ADDRESS_LIST } from '@/lib/constants';
import { getBalance } from '@/lib/web3/balance';
import { useAppSelector } from '@/store/hooks';
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

const SelectToken = ({
  balance,
  setBalance,
  tokenName,
  setTokenName,
}: SelectTokenProps) => {
  const address = useAppSelector((state) => state.wallet.address);

  useEffect(() => {
    if (tokenName) {
      updateBalance(tokenName);
    }
  }, [address, tokenName]);

  const updateBalance = async (tokenName: string) => {
    const balance = await getBalance(tokenName);
    if (balance) {
      setBalance(balance);
    }
  };

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
