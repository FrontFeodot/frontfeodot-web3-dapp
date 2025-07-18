'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { getAppState, useAppDispatch } from '../hooks';
import { JsonRpcProvider } from 'ethers';
import { connectWallet } from '@/lib/web3/connectWallet';
import { setWallet } from '../slices/walletSlice';
import { getBalance } from '@/lib/web3/balance';

interface Web3Context {
  browserProvider: BrowserProvider | null;
  jsonRpcProvider: JsonRpcProvider | null;
}

const EthersContext = createContext<Web3Context | null>(null);

let browserProvider: BrowserProvider | null = null;

let jsonRpcProvider: JsonRpcProvider | null = null;

export function EthersProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [web3Context, setWeb3Context] = useState({
    browserProvider,
    jsonRpcProvider,
  });

  let prev = BigInt(0);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', onAccountChanged);
      if (!browserProvider || !jsonRpcProvider) {
        jsonRpcProvider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );
        browserProvider = new BrowserProvider(window.ethereum);
        setWeb3Context({ browserProvider, jsonRpcProvider });
      }
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', onAccountChanged);
      }
    };
  }, []);

  const onAccountChanged = async (accounts: string[]) => {
    console.log('accountsChanged via window.ethereum:', accounts[0]);

    const currentAccount = getAppState()?.wallet?.address;
    if (currentAccount === accounts[0] || !currentAccount) return;
    const newAccount = accounts[0];
    jsonRpcProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    browserProvider = new BrowserProvider(window.ethereum);
    const walletState = await connectWallet(newAccount);
    if (!walletState) return;

    dispatch(setWallet(walletState));
  };

  return (
    <EthersContext.Provider value={web3Context}>
      {children}
    </EthersContext.Provider>
  );
}

export const useEthersProvider = (): Web3Context => {
  const prov = useContext(EthersContext);
  if (!prov) throw new Error('EthersProvider is not initialized');
  return prov;
};

export const getBrowserProvider = (): BrowserProvider | null => {
  if (browserProvider) return browserProvider;

  browserProvider = new BrowserProvider(window.ethereum);
  return browserProvider;
};
export const getJsonRpcProvider = (): JsonRpcProvider | null => {
  if (jsonRpcProvider) return jsonRpcProvider;

  jsonRpcProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  return jsonRpcProvider;
};
