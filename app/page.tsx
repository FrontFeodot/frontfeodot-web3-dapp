import { Box, Paper, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignContent: 'center',
        width: '100%',
        overflow: 'auto',
        padding: 4,
      }}
    >
      <Typography textAlign={'center'} color="primary" variant="h1">
        Welcome to the Swap Dapp!
      </Typography>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #000000 0%, #2C2C2C 80%)',
        }}
        elevation={24}
      >
        <Typography textAlign={'center'} color="success" variant="h4">
          Here you can swap tokens via Uniswap v3 pools
        </Typography>
        <Typography textAlign={'center'} color="success" variant="h5">
          or
        </Typography>
        <Typography textAlign={'center'} color="success" variant="h4">
          Transfer tokens from your wallet to another one
        </Typography>
      </Paper>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #000000 0%, #2C2C2C 80%)',
        }}
        elevation={24}
      >
        <Typography textAlign={'center'} color="secondary" variant="h4">
          Here you can find top 50 tokens from Uniswap v3 pools on Base network,
          including native token
        </Typography>
      </Paper>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #000000 0%, #2C2C2C 80%)',
        }}
        elevation={24}
      >
        <Typography textAlign={'center'} color="info" variant="h4">
          At first you need to connect your Metamask wallet on top right corner
        </Typography>
        <Typography textAlign={'center'} color="info" variant="h4">
          *Pay attention to the network you are using. Currently we support only
          Base network
        </Typography>
      </Paper>
    </Box>
  );
}
