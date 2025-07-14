'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Container } from '@mui/material';
import ConnectWalletButton from '../connectWalletButton/ConnectWalletButton';
import { NAV_ROUTES } from '@/lib/constants';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row' }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            flexGrow: 1,
            marginLeft: '200px',
          }}
        >
          {NAV_ROUTES.map((route) => (
            <Typography variant="h6" component="div" key={route.name}>
              <Link href={route.href}>{route.name}</Link>
            </Typography>
          ))}
        </Toolbar>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
          }}
        >
          <ConnectWalletButton />
        </Container>
      </AppBar>
    </Box>
  );
}
