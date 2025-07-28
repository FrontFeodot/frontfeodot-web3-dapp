'use client';

import Button from '@mui/material/Button';
import { FormControl, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { injected, useAccount, useConnect, useDisconnect } from 'wagmi';

const ConnectWalletButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isConnected) {
      return setAnchorEl(event.currentTarget);
    }
    connect({ connector: injected() });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnectClick = () => {
    disconnect();
    handleMenuClose();
  };

  return (
    <FormControl fullWidth>
      <Button
        id="profile-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        sx={{ padding: '8px' }}
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
          {isConnected ? address : 'Connect Wallet'}
        </Typography>
      </Button>
      <Menu
        disableScrollLock
        id="profile-menu"
        open={open}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
      >
        {isConnected ? (
          <MenuItem
            aria-labelledby="profile-button"
            sx={{ width: anchorEl && anchorEl.offsetWidth }}
            onClick={handleDisconnectClick}
          >
            Disconnect
          </MenuItem>
        ) : null}
      </Menu>
    </FormControl>
  );
};

export default ConnectWalletButton;
