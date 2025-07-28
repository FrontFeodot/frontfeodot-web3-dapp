'use client';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { handleV3Swap, prepareSwap } from '@/lib/web3/swap';

const Swap = () => {
  const [status, setStatus] = useState('');

  const handleSwap = async () => {
    setStatus('Swapping...');
    const swapParams = await prepareSwap({
      tokenInName: 'ETH',
      tokenOutName: 'USDC',
      amountInString: '0.1',
    });

    await handleV3Swap(swapParams);
    setStatus('Success');
  };

  return (
    <>
      <h1>Swap</h1>
      <Box>
        <Typography variant="h6">V3 polls swap</Typography>
        <button onClick={handleSwap}>Swap ETH for USDC</button>
        {/* <button onClick={handleSwapBack}>Swap USDC for ETH</button> */}
      </Box>
      <p>{status}</p>
    </>
  );
};

export default Swap;
