import { TOKEN_ADDRESS_LIST } from '@/lib/constants';
import { Box } from '@mui/material';
import TokenListItem from './TokenListItem';

const TokenList = () => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '50%' }}
    >
      {Object.keys(TOKEN_ADDRESS_LIST).map((tokenName) => (
        <TokenListItem key={tokenName} token={tokenName} />
      ))}
    </Box>
  );
};

export default TokenList;
