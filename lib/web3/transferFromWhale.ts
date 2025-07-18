import { ethers, JsonRpcSigner } from 'ethers';
import { ERC20_ABI, TOKEN_ADDRESS_LIST } from '../constants';
import { getJsonRpcProvider } from '@/store/ethersProvider/ethersProvider';

export const transferFromWhale = async (
  address: string,
  amount: string,
  tokenName: keyof typeof TOKEN_ADDRESS_LIST,
  addressTo: string
) => {
  const provider = getJsonRpcProvider();
  if (!provider) throw new Error('provider is not initialized');
  const defaultWhalePublic =
    tokenName === 'ETH'
      ? '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
      : '0x0B0A5886664376F59C351ba3f598C8A8B4D0A6f3';

  const whalePublic = addressTo || defaultWhalePublic;
  console.log(whalePublic);
  if (tokenName !== 'ETH') {
    const ERC20_Address = TOKEN_ADDRESS_LIST[tokenName];

    const rpcProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    console.log('rpcProvider', rpcProvider);

    const impersonateResult = await rpcProvider.send(
      'hardhat_impersonateAccount',
      [whalePublic]
    );

    await rpcProvider.send('hardhat_setBalance', [
      whalePublic,
      '0x56BC75E2D63100000',
    ]);
    console.log('impersonateResult', impersonateResult);

    const signer = new JsonRpcSigner(rpcProvider, whalePublic);
    if (!signer) throw new Error('signer is not initialized');

    const USDC_contract = new ethers.Contract(ERC20_Address, ERC20_ABI, signer);

    const balanceUSDC = await USDC_contract.balanceOf(whalePublic);

    const balanceETH = await rpcProvider.getBalance(whalePublic);
    console.log('balanceUSDC balanceETH', balanceUSDC, balanceETH);

    const decimals = await USDC_contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);
    console.log('amount, balance', parsedAmount, balanceUSDC);

    const tx = await USDC_contract.transfer(address, parsedAmount);

    console.log(tx);
    const receipt = await tx.wait();

    console.log('receipt', receipt);

    const newWhaleBalance = await USDC_contract.balanceOf(whalePublic);
    if (!newWhaleBalance)
      throw new Error('newWhaleBalance balance is not initialized');

    const newUserBalance = await USDC_contract.balanceOf(address);
    if (!newUserBalance)
      throw new Error('newUserBalance balance is not initialized');

    console.log(`whale balacne after rug: ${newWhaleBalance}`);
    console.log(`user balance after rug: ${newUserBalance}`);
    return;
  } else {
    const rpcProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const signer = new JsonRpcSigner(rpcProvider, whalePublic);

    const whaleBalance = await provider.getBalance(whalePublic); // getWalletBalance(whalePublic);
    if (!whaleBalance) throw new Error('whale balance is not initialized');
    console.log(`whale balacne before rug: ${whaleBalance}`);

    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.parseUnits(amount, 18),
    });

    console.log('tx', tx);
    const receipt = await tx.wait();
    console.log('receipt', receipt);
    const newWhaleBalance = await provider.getBalance(whalePublic); //  getWalletBalance(whalePublic);
    if (!newWhaleBalance)
      throw new Error('newWhaleBalance balance is not initialized');

    const newUserBalance = await provider.getBalance(address);
    if (!newUserBalance)
      throw new Error('newUserBalance balance is not initialized');

    console.log(`whale balacne after rug: ${newWhaleBalance}`);
    console.log(`user balance after rug: ${newUserBalance}`);
  }
};
