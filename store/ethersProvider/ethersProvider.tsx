'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useAppSelector } from '../hooks';

const EthersContext = createContext<BrowserProvider | null>(null);

let browserProvider: BrowserProvider | null = new BrowserProvider(
  window.ethereum
);

export function EthersProvider({ children }: { children: ReactNode }) {
  const address = useAppSelector((state) => state.wallet.address);

  useEffect(() => {
    browserProvider = new BrowserProvider(window.ethereum);
  }, [address]);

  return (
    <EthersContext.Provider value={browserProvider}>
      {children}
    </EthersContext.Provider>
  );
}

export const useEthersProvider = (): BrowserProvider => {
  const prov = useContext(EthersContext);
  if (!prov) throw new Error('EthersProvider is not initialized');
  return prov;
};

export const getEthersProvider = (): BrowserProvider | null => browserProvider;
