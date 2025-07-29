import {
  Address,
  erc20Abi,
  formatUnits,
  isAddress,
  parseEther,
  parseUnits,
} from 'viem';
import { getDecimals, getTokenAddress, isNativeTokenName } from './utils';
import { DefinedWalletClient } from './types';
import { getPublicClient, getWalletClient } from './clients';

export const transferToWallet = async (
  receiver: string,
  amount: string,
  tokenName: string
): Promise<Error | undefined> => {
  try {
    const isValidAddress = isAddress(receiver);
    if (!isValidAddress) throw new Error('Invalid address');
    const walletClient = getWalletClient();
    const publicClient = getPublicClient();

    const isNative = isNativeTokenName(tokenName);
    let response: Address | Error;
    if (isNative) {
      response = await transferNative(receiver, amount, walletClient);
    } else {
      const tokenAddress = getTokenAddress(tokenName);

      response = await transferERC_20(
        receiver,
        amount,
        walletClient,
        tokenAddress
      );
    }

    if (response instanceof Error) throw response;
    const hash = response as Address;
    await publicClient.waitForTransactionReceipt({
      hash,
    });
  } catch (error) {
    console.error('transfer error:', error);
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};

const transferNative = async (
  receiver: Address,
  amount: string,
  walletClient: DefinedWalletClient
): Promise<Address | Error> => {
  try {
    const value = parseEther(amount);

    const hash = await walletClient.sendTransaction({
      to: receiver,
      value,
    });
    return hash;
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};

const transferERC_20 = async (
  receiver: Address,
  amount: string,
  walletClient: DefinedWalletClient,
  tokenAddress: Address
): Promise<Address | Error> => {
  try {
    const decimals = await getDecimals(tokenAddress);
    const value = parseUnits(amount, decimals);

    const publicClient = getPublicClient();
    const [sender] = await walletClient.getAddresses();

    const balance: bigint = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [sender],
    });
    if (balance < value) {
      throw new Error(
        `Not enough balance: balance ${formatUnits(balance, decimals)} < amount ${formatUnits(value, decimals)}`
      );
    }

    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [receiver, value],
    });
    return hash;
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error('Something went wrong');
  }
};
