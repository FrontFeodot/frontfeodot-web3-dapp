import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import ConnectWalletButton from '../connectWalletButton/ConnectWalletButton';
import NavBar from './NavBar';

export default function Header() {
  return (
    <Box className="header" sx={{ flexGrow: 1, backgroundColor: '#1F1F1F' }}>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row' }}>
        <NavBar />
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '200px',
            width: 'auto',
          }}
        >
          <ConnectWalletButton />
        </Container>
      </AppBar>
    </Box>
  );
}
