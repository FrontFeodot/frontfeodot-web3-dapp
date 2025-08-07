import type { Metadata } from 'next';
import './globals.css';
import AppThemeProvider from '@/styles/theme';
import Header from '@/components/nav/Header';
import ReduxProvider from '@/store/provider';
import { cookieToInitialState } from 'wagmi';
import { getWagmiConfig } from '@/lib/web3/wagmiConfig';
import { headers } from 'next/headers';
import WagmiProvider from '@/store/wagmiProvider/WagmiProvider';
import { Box } from '@mui/material';
import PriceTicker from '@/components/priceTicker/PriceTicker';

export const metadata: Metadata = {
  title: 'Swap Dapp',
  description: 'Welcome to the Swap Dapp!',
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getWagmiConfig(),
    (await headers()).get('cookie')
  );
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <WagmiProvider initialState={initialState}>
            <ReduxProvider>
              <Header />
              <PriceTicker />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 'calc(100vh - 64px)',
                }}
              >
                {children}
              </Box>
            </ReduxProvider>
          </WagmiProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
