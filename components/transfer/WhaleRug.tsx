'use client';

import { transferFromWhale } from '@/lib/web3/transferFromWhale';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import SelectToken from './SelectToken';
import { useAppSelector } from '@/store/hooks';

const RugWhale = () => {
  const [balance, setBalance] = useState('');
  const [tokenName, setTokenName] = useState('ETH');
  const [addressTo, setAddressTo] = useState('');
  const [amount, setAmount] = useState('');
  const address = useAppSelector((state) => state.wallet.address);

  if (!address) return null;

  const handleClick = async () => {
    if (!address) return;
    await transferFromWhale(address, amount, tokenName, addressTo);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="h3">Rug the whale</Typography>
      <Divider />
      <Typography variant="h6">Whale address (not required)</Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={addressTo}
        onChange={(e) => {
          setAddressTo(e.target.value);
        }}
      />
      <Typography variant="h6">Amount</Typography>

      <TextField
        fullWidth
        variant="outlined"
        required
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />
      <SelectToken
        balance={balance}
        setBalance={setBalance}
        tokenName={tokenName}
        setTokenName={setTokenName}
      />
      <Button variant="contained" onClick={handleClick}>
        Rug whale
      </Button>
    </Box>
  );
};

export default RugWhale;
