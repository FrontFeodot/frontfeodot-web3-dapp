import { getNativeBalance } from './balance';
import { getBrowserProvider } from '@/store/ethersProvider/ethersProvider';
import { ethers } from 'ethers';
import { ERC20_ABI, TOKEN_ADDRESS_LIST } from '../constants';
import { getAppState } from '@/store/hooks';
import { BrowserProvider } from 'ethers';

export const transferToWallet = async (
  receiver: string,
  amount: string,
  tokenName: string
): Promise<number | Error> => {
  try {
    const provider = getBrowserProvider();
    if (!provider) throw new Error('Provider is not initialized');

    const isValidAddress = ethers.isAddress(receiver);
    if (!isValidAddress) throw new Error('Invalid address');
    if (tokenName === 'ETH') {
      return await transferETH(receiver, amount, provider);
    } else {
      return await transferERC_20(receiver, amount, provider, tokenName);
    }
  } catch (error) {
    console.error('transfer error:', error);
    if ((error as { code: string }).code) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'ACTION_REJECTED':
          return new Error('User denied transaction signature.');
        case 'INSUFFICIENT_FUNDS':
          return new Error('Insufficient funds in wallet.');
        case 'UNSUPPORTED_OPERATION':
          return new Error('Unsupported operation.');
        default: {
          if (error instanceof Error) return error;
          return new Error('Something went wrong');
        }
      }
    }
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};

const transferETH = async (
  receiver: string,
  amount: string,
  provider: BrowserProvider
): Promise<Error | number> => {
  const balance = await getNativeBalance();
  if (!balance) throw new Error('Cannot get balance');

  if (ethers.parseEther(balance) < ethers.parseEther(amount))
    throw new Error('Not enough balance');

  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: receiver,
    value: ethers.parseEther(amount),
  });

  const fullifiledTransaction = await tx.wait();

  if (fullifiledTransaction?.status === 0) {
    throw new Error('Transaction was reverted');
  }
  return 1;
};

const transferERC_20 = async (
  receiver: string,
  amount: string,
  provider: BrowserProvider,
  tokenName: string
): Promise<number> => {
  const sender = getAppState().wallet.address;
  if (!sender) throw new Error('Address is not initialized');
  const signer = await provider.getSigner();

  const ERC20_Address = TOKEN_ADDRESS_LIST[tokenName];

  const contract = new ethers.Contract(ERC20_Address, ERC20_ABI, signer);

  const decimals = await contract.decimals();

  const balance = await contract.balanceOf(sender);

  if (balance < ethers.parseUnits(amount, decimals).toString())
    throw new Error('Not enough balance');

  const tx = await contract.transfer(
    receiver,
    ethers.parseUnits(amount, decimals)
  );
  const fullifiledTransaction = await tx.wait();

  if (fullifiledTransaction?.status === 0) {
    throw new Error('Transaction was reverted');
  }
  return 1;
};
