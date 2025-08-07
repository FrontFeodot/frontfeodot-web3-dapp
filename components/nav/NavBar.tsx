'use client';

import { NAV_ROUTES } from '@/lib/constants';
import { Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

const NavBar = () => {
  const pathname = usePathname();
  const isSelected = (path: string) => pathname === path;
  const { isConnected } = useAccount();
  return (
    <Toolbar
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexGrow: 1,
      }}
    >
      {isConnected ? (
        NAV_ROUTES.map((route) => (
          <Typography
            variant="h6"
            component="div"
            key={route.name}
            color={`${isSelected(route.href) ? 'primary' : 'inherit'}`}
          >
            <Link href={route.href}>{route.name}</Link>
          </Typography>
        ))
      ) : (
        <Typography
          variant="h6"
          component="div"
          color={`${isSelected('/') ? 'primary' : 'inherit'}`}
        >
          <Link href="/">Home</Link>
        </Typography>
      )}
    </Toolbar>
  );
};

export default NavBar;
