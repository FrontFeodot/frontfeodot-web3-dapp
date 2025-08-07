'use client';

import { getWagmiConfig } from '@/lib/web3/wagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { State, WagmiProvider as Provider } from 'wagmi';

interface WagmiProviderProps {
  children: ReactNode;
  initialState: State | undefined;
}

const WagmiProvider = ({ children, initialState }: WagmiProviderProps) => {
  const [config] = useState(() => getWagmiConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

export default WagmiProvider;
