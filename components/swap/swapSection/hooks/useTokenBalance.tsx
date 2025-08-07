import { Token } from '@/lib/web3/types/token.types';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

const useTokensBalance = (tokenIn: Token | null, tokenOut: Token | null) => {
  const { address } = useAccount();
  const {
    data: tokenInBalance,
    refetch: tokenInBalanceRefetch,
    isLoading: isTokenInLoading,
  } = useBalance({
    address,
    ...(tokenIn?.symbol !== 'ETH' ? { token: tokenIn?.id } : {}),
  });
  const {
    data: tokenOutBalance,
    refetch: tokenOutBalanceRefetch,
    isLoading: isTokenOutLoading,
  } = useBalance({
    address,
    ...(tokenOut?.symbol !== 'ETH' ? { token: tokenOut?.id } : {}),
  });

  const refetchBalances = () => {
    if (tokenInBalanceRefetch) {
      tokenInBalanceRefetch();
    }
    if (tokenOutBalanceRefetch) {
      tokenOutBalanceRefetch();
    }
  };

  return {
    tokenInBalance: {
      value: tokenInBalance
        ? formatUnits(tokenInBalance.value, tokenInBalance.decimals)
        : '',
      isLoading: isTokenInLoading,
    },
    tokenOutBalance: {
      value: tokenOutBalance
        ? formatUnits(tokenOutBalance.value, tokenOutBalance.decimals)
        : '',
      isLoading: isTokenOutLoading,
    },
    refetchBalances,
  };
};

export default useTokensBalance;
