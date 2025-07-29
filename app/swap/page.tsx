import { Paper } from '@mui/material';
import TokenList from '@/components/swap/tokenList/TokenList';
import SwapSection from '@/components/swap/swapSection/SwapSection';

const Swap = () => {
  return (
    <Paper
      elevation={24}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        alignContent: 'center',
        alignSelf: 'center',
        maxWidth: '1280px',
        width: '100%',
        padding: 4,
        borderRadius: 3,
        background: 'linear-gradient(180deg, #000000 0%, #2C2C2C 80%)',
      }}
    >
      <TokenList />
      <SwapSection />
    </Paper>
  );
};

export default Swap;
