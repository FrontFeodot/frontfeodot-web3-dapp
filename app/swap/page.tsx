'use client';

import {
  ERC20_ABI,
  QUOTER_ABI,
  V_2_ROUTER_ABI,
  SWAP_ROUTER_ADDRESS,
  SWAP_ABI,
} from '@/lib/constants';
import { getBrowserProvider } from '@/store/ethersProvider/ethersProvider';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { getAppState } from '@/store/hooks';
import { ethers } from 'ethers';

const UNISWAP_V2_ROUTER = '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';

const QUOTER_ADDRESS = '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a';


const Swap = () => {
  const [status, setStatus] = useState('');

  const handleSwap = async () => {
    try {
      setStatus('Sending transaction...');

      const provider = getBrowserProvider();
      if (!provider) throw new Error('Provider is not initialized');
      const signer = await provider.getSigner();

      const router = new ethers.Contract(
        UNISWAP_V2_ROUTER,
        V_2_ROUTER_ABI,
        signer
      );
      console.log('router', router);
      const amountIn = ethers.parseEther('0.1');

      const path = [WETH_ADDRESS, USDC_ADDRESS];
      const amountsOut = await router.getAmountsOut(amountIn, path);
      console.log('amountsOut', amountsOut);

      const rawOut = amountsOut[1];
      const slippage = rawOut / BigInt(100); // 1%
      const amountOutMin: bigint = rawOut - slippage;
      console.log('amountOutMin', amountOutMin);

      const to = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline,
        { value: amountIn }
      );
      console.log('tx', tx);
      setStatus(`Success!! Swapped tx: ${tx.hash}`);

      // 10) Ждём подтверждения
      await tx.wait();
      setStatus(`Успех! TxHash: ${tx.hash}`);
    } catch (err: any) {
      setStatus(`Ошибка: ${err.message}`);
    }
  };

  const handleSwapBack = async () => {
    try {
      setStatus('Sending transaction...');

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      const router = new ethers.Contract(
        UNISWAP_V2_ROUTER,
        V_2_ROUTER_ABI,
        signer
      );
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);

      const amountIn: bigint = ethers.parseUnits('100', 6);

      const approvalTx = await usdc.approve(UNISWAP_V2_ROUTER, amountIn);
      setStatus(`Approve tx: ${approvalTx.hash}`);
      await approvalTx.wait();

      const path = [USDC_ADDRESS, WETH_ADDRESS];
      const amountsOut: bigint[] = (await router.getAmountsOut(
        amountIn,
        path
      )) as bigint[];

      const rawOut: bigint = amountsOut[1];
      const slippage: bigint = rawOut / BigInt(100); // 1%
      const amountOutMin: bigint = rawOut - slippage;

      const to = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline
      );
      setStatus(`Swap tx: ${tx.hash}`);

      await tx.wait();
      setStatus(`Success! Got ETH. TxHash: ${tx.hash}`);
    } catch (err: any) {
      setStatus(`Ошибка: ${err.message}`);
    }
  };
  const handleV3Swap = async () => {
    try {
      const browserProvider = getBrowserProvider();
      const address = getAppState()?.wallet?.address;
      if (!browserProvider || !address)
        throw new Error('Provider is not initialized');
      const signer = await browserProvider.getSigner();
      const fee = 3000n;
      const amountIn = ethers.parseUnits('0.1', 18);
      const slippageTolerancePercent = 50n;
      const deadline = Math.floor(Date.now() / 1_000) + 20 * 60;

      const quoter = new ethers.Contract(
        QUOTER_ADDRESS,
        QUOTER_ABI,
        browserProvider
      );

      const quotingParams = {
        tokenIn: WETH_ADDRESS,
        tokenOut: USDC_ADDRESS,
        fee: fee,
        amountIn: amountIn,
        sqrtPriceLimitX96: 0,
      };
      const [quotedAmountOut]: bigint[] =
        await quoter.quoteExactInputSingle.staticCall(quotingParams);

      const amountOutMin =
        (quotedAmountOut * (10000n - slippageTolerancePercent)) / 10000n;
      console.log(
        'quotedAmountOut, amountOutMin =>',
        quotedAmountOut,
        amountOutMin
      );

      const tokenInContract = new ethers.Contract(
        WETH_ADDRESS,
        ERC20_ABI,
        signer
      );

      const ownerAddress = await signer.getAddress();
      const currentAllowance: bigint = await tokenInContract.allowance(
        ownerAddress,
        SWAP_ROUTER_ADDRESS
      );
      console.log('currentAllowance', currentAllowance);
      if (currentAllowance < amountIn) {
        console.log('Approving router to spend WETH…');
        const txApprove = await tokenInContract.approve(
          SWAP_ROUTER_ADDRESS,
          amountIn
        );
        await txApprove.wait();
        console.log('Approved.');
      }
      console.log(amountOutMin);
      const router = new ethers.Contract(SWAP_ROUTER_ADDRESS, SWAP_ABI, signer);
      const params = {
        tokenIn: WETH_ADDRESS,
        tokenOut: USDC_ADDRESS,
        fee: 3000,
        recipient: ownerAddress,
        deadline: deadline,
        amountIn: amountIn,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0,
      };

      console.log('Sending swap transaction…');
      const tx = await router.exactInputSingle(params, { value: 0 });
      console.log('TX hash:', tx.hash);
      await tx.wait();
      console.log('Swap completed!');
      setStatus(`Success! Got USDC. TxHash: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Ошибка: ${err.message}`);
    }
  };

  return (
    <>
      <h1>Swap</h1>
      <Box>
        <Typography variant="h6">V2 polls swap</Typography>
        <button onClick={handleSwap}>Swap ETH for USDC</button>
        <button onClick={handleSwapBack}>Swap USDC for ETH</button>
      </Box>
      <Box>
        <Typography variant="h6">V3 polls swap</Typography>
        <button onClick={handleV3Swap}>Swap ETH for USDC</button>
        {/* <button onClick={handleSwapBack}>Swap USDC for ETH</button> */}
      </Box>
      <p>{status}</p>
    </>
  );
};

export default Swap;
