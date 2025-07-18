'use client';

import { NAV_ROUTES } from '@/lib/constants';
import { Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  const isSelected = (path: string) => pathname === path;

  return (
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
        <Typography
          sx={{
            borderBottom: `2px solid ${isSelected(route.href) ? '#239A3B' : 'transparent'}`,
          }}
          variant="h6"
          component="div"
          key={route.name}
          color={`${isSelected(route.href) ? 'primary' : 'inherit'}`}
        >
          <Link href={route.href}>{route.name}</Link>
        </Typography>
      ))}
    </Toolbar>
  );
};

export default NavBar;
