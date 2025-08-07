'use client';

import { transferFromWhale } from '@/lib/web3/transferFromWhale';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import SelectToken from './SelectToken';
import { useAccount } from 'wagmi';
import { RefetchBalance } from '@/lib/web3/types/common.types';
import { Token } from '@/lib/web3/types/token.types';

const RugWhale = ({ tokenList }: { tokenList: Token[] }) => {
  const refetchRef = useRef<RefetchBalance | null>(null);
  const [token, setToken] = useState<Token>(tokenList[0]);
  const [whaleAddress, setWhaleAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();

  const handleClick = async () => {
    if (!address || !token) return;
    await transferFromWhale({
      to: address,
      amount,
      token,
      whale: whaleAddress,
    });
    if (refetchRef.current) {
      refetchRef.current();
    }
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
        value={whaleAddress}
        onChange={(e) => {
          setWhaleAddress(e.target.value);
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
        token={token}
        setToken={setToken}
        tokenList={tokenList}
        refetchRef={refetchRef}
      />
      <Button variant="contained" onClick={handleClick}>
        Rug whale
      </Button>
    </Box>
  );
};

export default RugWhale;
