import { Box } from '@mui/material';
import TokenListItem from './TokenListItem';
import { getCachedTokens } from '@/lib/graphql/getCachedTokens';

const TokenList = async () => {
  const tokenList = await getCachedTokens();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        overflow: 'auto',
        height: '100%',
        borderRadius: 3,
        border: '1px solid #FFA040',
      }}
    >
      {tokenList.map((token) => (
        <TokenListItem key={token.symbol} token={token} />
      ))}
    </Box>
  );
};

export default TokenList;
