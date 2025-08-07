import { Paper, Typography } from '@mui/material';
import TokenList from '@/components/swap/tokenList/TokenList';
import SwapSection from '@/components/swap/swapSection/SwapSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swap',
  description: 'Swap the top 50 tokens via Uniswap v3 pools on the Base network.',
};

const Swap = () => {
  return (
    <Paper
      elevation={24}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignContent: 'center',
        alignSelf: 'center',
        maxWidth: '1280px',
        width: '100%',
        height: '90%',
        maxHeight: '900px',
        padding: 4,
        borderRadius: 3,
        background: 'linear-gradient(90deg, #000000 0%, #2C2C2C 80%)',
        overflow: 'hidden',
      }}
    >
      <SwapSection />
      <Typography
        sx={{ textAlign: 'center', marginY: 2 }}
        color="secondary"
        variant="h4"
        fontWeight="bold"
        textTransform="uppercase"
      >
        Choose tokens for swap
      </Typography>

      <TokenList />
    </Paper>
  );
};

export default Swap;
