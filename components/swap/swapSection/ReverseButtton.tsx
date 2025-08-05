'use client';
import { Token } from '@/lib/web3/types/token.types';
import { useAppDispatch } from '@/store/hooks';
import { setTokenIn, setTokenOut } from '@/store/slices/swapSlice';
import { SvgIcon } from '@mui/material';

export function ReverseTokens({
  tokenIn,
  tokenOut,
}: {
  tokenIn: Token;
  tokenOut: Token;
}) {
  const dispatch = useAppDispatch();

  const handleReverseTokens = () => {
    dispatch(setTokenIn(tokenOut));
    dispatch(setTokenOut(tokenIn));
  };
  return (
    <SvgIcon
      sx={{ alignSelf: 'center', cursor: 'pointer' }}
      onClick={handleReverseTokens}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
      >
        <path
          fill="currentColor"
          d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99zM9 3L5 6.99h3V14h2V6.99h3z"
        ></path>
      </svg>
    </SvgIcon>
  );
}
