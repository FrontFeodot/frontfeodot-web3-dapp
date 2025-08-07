import { Token } from '@/lib/web3/types/token.types';

export const fetchTokens = async (): Promise<Token[]> => {
  const res = await fetch('/api/tokens');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};
