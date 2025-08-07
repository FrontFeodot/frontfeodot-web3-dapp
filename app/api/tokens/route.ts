import { getCachedTokens } from '@/lib/graphql/getCachedTokens';
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
