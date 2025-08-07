import TransferTokens from '@/components/transfer/TokensTransfer';
import { getCachedTokens } from '@/lib/graphql/getCachedTokens';
import { Box } from '@mui/material';

const Transfer = async () => {
  const tokenList = await getCachedTokens();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignContent: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          maxWidth: '800px',
          width: '100%',
          padding: 4,
          borderRadius: 3,
          background: 'linear-gradient(180deg, #000000 0%, #2C2C2C 80%)',
        }}
      >
        <TransferTokens tokenList={tokenList} />
      </Box>
    </Box>
  );
};

export default Transfer;
