'use server';

import {
  createPublicClient,
  createWalletClient,
  formatUnits,
  http,
  parseUnits,
} from 'viem';
import { erc20Abi } from 'viem';
import { Address } from 'viem';
import { hardhatFork } from './wagmiConfig';
import { Token } from './types/token.types';
import { isNativeTokenSymbol } from '../../app/actions/utils';

interface TransferParams {
  to: Address;
  amount: string;
  token: Token;
  whale?: string;
}

// RPC URL for your Hardhat fork
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';

// Initialize a viem public client for arbitrary JSON-RPC
const publicClient = createPublicClient({
  chain: hardhatFork,
  transport: http(RPC_URL),
});

// Factory to create an impersonated wallet client
const createWhaleClient = (address: Address) =>
  createWalletClient({
    chain: hardhatFork,
    transport: http(RPC_URL),
    account: address,
  });

/**
 * Transfers tokens or ETH from a whale (impersonated) to a recipient in Hardhat fork.
 */
export async function transferFromWhale({
  to,
  amount,
  token,
  whale,
}: TransferParams) {
  try {
    const isNative = await isNativeTokenSymbol(token.symbol);
    // Default whale addresses for ETH or ERC20
    const defaultWhale = isNative
      ? '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
      : '0x0B0A5886664376F59C351ba3f598C8A8B4D0A6f3';
    const whaleAddress = (whale || defaultWhale) as Address;

    // Impersonate the whale
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (publicClient as any).request({
      method: 'hardhat_impersonateAccount',
      params: [whaleAddress],
    });

    // Add ETH for gas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (publicClient as any).request({
      method: 'hardhat_setBalance',
      params: [whaleAddress, '0x56BC75E2D63100000'],
    });

    const whaleWalletClient = createWhaleClient(whaleAddress);

    if (!isNative) {
      // ERC20 transfer
      // Read decimals
      const value = parseUnits(amount, token.decimals);

      const tokenBalance = await publicClient.readContract({
        address: token.id as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [whaleAddress],
      });
      console.log(
        `Whale ${token} balance:`,
        formatUnits(tokenBalance, token.decimals)
      );

      console.log(
        `Transferring ${amount} ${token} from ${whaleAddress} to ${to}`
      );
      // Execute transfer
      const hash = await whaleWalletClient.writeContract({
        address: token.id as Address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [to, value],
      });
      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      console.log(
        `Transfered ${amount} ${token} from ${whaleAddress} to ${to}`
      );
    } else {
      // Native ETH transfer
      const value = parseUnits(amount, 18);

      const hash = await whaleWalletClient.sendTransaction({
        to,
        value,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      console.log(`Transfered ${amount} ETH from ${whaleAddress} to ${to}`);
    }
  } catch (err) {
    console.error('Error transferring token:', err);
  }
}
