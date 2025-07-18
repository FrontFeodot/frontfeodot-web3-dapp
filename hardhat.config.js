require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');

const ALCHEMY_BASE_URL = process.env.ALCHEMY_BASE_URL;

module.exports = {
  solidity: '0.8.18',
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_BASE_URL,
      },
      chainId: 1337,
      chains: {
        8453: {
          hardforkHistory: {
            berlin: 12244000, // Berlin
            london: 12965000, // London
            shanghai: 17034870, // Shanghai
            cancun: 19426786, // Cancun‑Deneb (Dencun)
          },
        },
      },
    },
  },
};
