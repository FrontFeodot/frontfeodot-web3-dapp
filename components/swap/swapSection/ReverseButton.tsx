'use client';
import { Token } from '@/lib/web3/types/token.types';
import { useAppDispatch } from '@/store/hooks';
import { setTokenIn, setTokenOut } from '@/store/slices/swapSlice';
import { SvgIcon } from '@mui/material';

const ReverseTokens = ({
  tokenIn,
  tokenOut,
}: {
  tokenIn: Token | null;
  tokenOut: Token | null;
}) => {
  const dispatch = useAppDispatch();
  const disabled = !tokenIn || !tokenOut;
  const handleReverseTokens = () => {
    if (disabled) return;
    dispatch(setTokenIn(tokenOut));
    dispatch(setTokenOut(tokenIn));
  };
  return (
    <SvgIcon
      sx={{
        position: 'relative',
        bottom: 12,
        alignSelf: 'center',
        cursor: 'pointer',
        pointerEvents: disabled ? 'none' : 'auto',
        color: disabled ? '#2c2c2c' : '#fff',
      }}
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
};

export default ReverseTokens;
