import { Token } from './web3/types/token.types';

const GRAPH_URL =
  'https://gateway.thegraph.com/api/subgraphs/id/GENunSHWLBXm59mBSgPzQ8metBEp9YDfdqwFr91Av1UM';

const nativeETH: Token = {
  id: '0x4200000000000000000000000000000000000006',
  symbol: 'ETH',
  name: 'Ethereum',
  derivedETH: '1',
  decimals: 18,
};

export const getCachedTokens = async (): Promise<Token[]> => {
  try {
    const res = await fetch(GRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.THE_GRAPH_API_KEY}`,
      },
      body: JSON.stringify({
        query: `{
          tokens(first: 50, orderBy: volumeUSD, orderDirection: desc) {
            id
            symbol
            name
            derivedETH
            tokenDayData(first: 2, orderBy: date, orderDirection: desc) {
              priceUSD
            }
            decimals
          }
        }`,
      }),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GraphQL fetch failed: ${res.status} ${text}`);
    }

    const { data, errors } = (await res.json()) as {
      data: { tokens: Token[] };
      errors?: { message: string }[];
    };
    if (Array.isArray(errors) && errors?.length) {
      throw new Error(
        `GraphQL errors: ${errors.map((e) => e.message).join(', ')}`
      );
    }

    data.tokens.unshift(nativeETH);
    return data.tokens;
  } catch (e) {
    console.error(e);
    return [] as Token[];
  }
};
