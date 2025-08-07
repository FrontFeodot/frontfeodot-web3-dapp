'use client';

import Button from '@mui/material/Button';
import { FormControl, Menu, MenuItem, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { injected, useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePathname, useRouter } from 'next/navigation';

const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

const ConnectWalletButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isConnected && pathname !== '/') {
      router.push('/');
    }
  }, [isConnected, pathname]);

  const open = Boolean(anchorEl);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isConnected) {
        return setAnchorEl(event.currentTarget);
      }
      connect({ connector: injected() });
    },
    [connect, isConnected]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDisconnectClick = useCallback(() => {
    disconnect();
    handleMenuClose();
  }, [disconnect, handleMenuClose]);

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
          {isConnected ? truncateAddress(address || '') : 'Connect Wallet'}
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
