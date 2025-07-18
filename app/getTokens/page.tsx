import RugWhale from '@/components/transfer/WhaleRug';
import { Box, Typography } from '@mui/material';

const GetTokens = () => {
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
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4">
          If you use hardhat fork, you can get tokens from whale
        </Typography>
        <Typography variant="h6">
          * Balance will changed after page update
        </Typography>
        <RugWhale />
      </Box>
    </Box>
  );
};

export default GetTokens;
