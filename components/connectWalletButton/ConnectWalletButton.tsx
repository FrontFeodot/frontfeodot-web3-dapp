'use client';

import Button from '@mui/material/Button';
import useWalletConnection from './hooks/useWalletConnection';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

export default function ConnectWalletButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { address, isConnected, handleConnect, handleDisconnect } =
    useWalletConnection();

  const open = Boolean(anchorEl);
  const hasConnection = isConnected && address;

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasConnection) {
      return setAnchorEl(event.currentTarget);
    }
    handleConnect();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnectClick = () => {
    handleDisconnect();
    handleMenuClose();
  };

  return (
    <>
      <Button
        id="profile-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        sx={{ padding: '8px' }}
        color="inherit"
        size="medium"
        variant="contained"
      >
        <Typography
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          variant="button"
        >
          {hasConnection ? address : 'Connect Wallet'}
        </Typography>
      </Button>
      <Menu
        disableScrollLock
        id="profile-menu"
        open={open}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
      >
        {hasConnection ? (
          <MenuItem onClick={handleDisconnectClick}>Disconnect</MenuItem>
        ) : null}
      </Menu>
    </>
  );
}
