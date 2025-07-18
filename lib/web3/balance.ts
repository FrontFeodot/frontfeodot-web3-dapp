import { getAppState } from '@/store/hooks';
import {
  getBrowserProvider,
  getJsonRpcProvider,
} from '@/store/ethersProvider/ethersProvider';
import { ethers, formatEther, formatUnits } from 'ethers';
import { ERC20_ABI, TOKEN_ADDRESS_LIST } from '../constants';

export const getBalance = async (tokenName: string): Promise<string> => {
  if (tokenName === 'ETH') {
    return getNativeBalance();
  }
  return getERC20Balance(tokenName);
};

export const getNativeBalance = async (): Promise<string> => {
  try {
    const address = getAppState()?.wallet?.address;
    if (!address) throw new Error('Address is not initialized');

    const provider = getBrowserProvider();
    console.log('getNativeBalance, provider', provider);
    if (!provider) throw new Error('Provider is not initialized');

    const balance = await provider.getBalance(address);
    if (!balance) throw new Error('Balance is not initialized');
    console.log('getNativeBalance, balance', balance);

    return formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0';
  }
};

export const getERC20Balance = async (tokenName: string): Promise<string> => {
  try {
    const address = getAppState()?.wallet?.address;
    const provider = getJsonRpcProvider();
    if (!provider || !address) throw new Error('Context is not initialized');
    const tokenAddress = TOKEN_ADDRESS_LIST[tokenName];
    const ERC_20_CONTRACT = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const balance = await ERC_20_CONTRACT.balanceOf(address);
    if (!balance) throw new Error('Cannot fetch balance');

    const decimals = await ERC_20_CONTRACT.decimals();
    if (!decimals) throw new Error('Cannot fetch decimals');

    return formatUnits(balance, decimals);
  } catch (error) {
    console.error(`Error fetching ${tokenName} balance:`, error);
    return '0';
  }
};
