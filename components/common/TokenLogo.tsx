import Image from 'next/image';
import { Address, checksumAddress } from 'viem';
import tokensLogos from '@/public/tokensLogos.json';

interface TokenLogoProps {
  id: Address;
  symbol: string;
}

const getTokenSrc = (address: Address, symbol: string): string => {
  const normalizedAddress = checksumAddress(address);
  if (symbol === 'ETH') {
    const ethLogoAddress = checksumAddress(
      '0xcb327b99ff831bf8223cced12b1338ff3aa322ff'
    );
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/${ethLogoAddress}/logo.png`;
  }
  const whitelistedLogos = Object.keys(tokensLogos);
  if (whitelistedLogos.includes(normalizedAddress)) {
    return (tokensLogos as Record<string, Address>)[normalizedAddress];
  }
  if (whitelistedLogos.includes(address)) {
    return (tokensLogos as Record<string, Address>)[address];
  }
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/${normalizedAddress}/logo.png`;
};

const TokenLogo = ({ id, symbol }: TokenLogoProps) => {
  const logoUrl = getTokenSrc(id, symbol);

  return (
    <Image
      src={logoUrl}
      alt={symbol}
      width={32}
      height={32}
      onError={() => {
        console.log('error', checksumAddress(id));
      }}
    />
  );
};

export default TokenLogo;
