import { getCachedTokens } from '@/lib/graphql/getCachedTokens';
import { Token } from '@/lib/web3/types/token.types';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await getCachedTokens();
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
};

export const fetchTokens = async (): Promise<Token[]> => {
  const res = await fetch('/api/tokens');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};
