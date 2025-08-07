'use client';

import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchTokens } from './fetchTokens';
import { Token } from '@/lib/web3/types/token.types';

const PriceTicker = ({ initialTokenList }: { initialTokenList: Token[] }) => {
  const { data: tokenList } = useQuery({
    queryKey: ['tokenList'],
    queryFn: fetchTokens,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    initialData: initialTokenList,
  });

  if (!tokenList) return null;

  return (
    <Box
      bgcolor={'background.paper'}
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        width: '100%',
        py: 1,
        height: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'tickerScroll 120s linear infinite',
        }}
      >
        {[...tokenList, ...tokenList].map(
          ({ symbol, tokenDayData: [today, yesterday] }, index) => {
            if (!today || !yesterday || symbol === 'ETH') return;
            const diffUSD = Number(today.priceUSD) - Number(yesterday.priceUSD);
            const diffPercent = (
              (diffUSD / Number(yesterday.priceUSD)) *
              100
            ).toFixed(2);
            const diff =
              Number(diffPercent) > 0 ? `+${diffPercent}%` : `${diffPercent}%`;

            return (
              <Box
                key={`${symbol}-${index}`}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 3,
                  fontSize: '0.875rem',
                  color: diff.startsWith('-') ? '#ff4d4f' : '#52c41a',
                }}
              >
                <Typography variant="body2" color="textPrimary" sx={{ mr: 1 }}>
                  {symbol}
                </Typography>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {Number(today.priceUSD).toFixed(4)}
                </Typography>
                <Typography variant="body2">({diff})</Typography>
              </Box>
            );
          }
        )}
      </Box>
    </Box>
  );
};

export default PriceTicker;
