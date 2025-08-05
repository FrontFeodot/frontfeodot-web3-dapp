import { Address } from 'viem';

export interface Token {
  id: Address;
  symbol: string;
  name: string;
  derivedETH: string;
  tokenDayData?: {
    priceUSD: string;
  }[];
  decimals: number;
}
