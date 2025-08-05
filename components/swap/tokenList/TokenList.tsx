import { Box } from '@mui/material';
import TokenListItem from './TokenListItem';
import { getCachedTokens } from '@/lib/getCachedTokens';

const TokenList = async () => {
  const tokenList = await getCachedTokens();
  console.log(tokenList);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        overflow: 'auto',
        height: '100%',
      }}
    >
      {tokenList.map((token) => (
        <TokenListItem key={token.symbol} token={token} />
      ))}
    </Box>
  );
};

export default TokenList;
