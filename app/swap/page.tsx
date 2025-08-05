import { Paper } from '@mui/material';
import TokenList from '@/components/swap/tokenList/TokenList';
import SwapSection from '@/components/swap/swapSection/SwapSection';

const Swap = () => {
  return (
    <Paper
      elevation={24}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignContent: 'center',
        alignSelf: 'center',
        maxWidth: '1280px',
        width: '100%',
        maxHeight: '60%',
        padding: 4,
        borderRadius: 3,
        background: 'linear-gradient(90deg, #000000 0%, #2C2C2C 80%)',
        overflow: 'hidden',
      }}
    >
      <SwapSection />
      <TokenList />
    </Paper>
  );
};

export default Swap;
