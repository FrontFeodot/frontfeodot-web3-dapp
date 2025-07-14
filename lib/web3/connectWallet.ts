import { getEthersProvider } from '@/store/ethersProvider/ethersProvider';

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = getEthersProvider();
      if (!provider) throw new Error('provider is not initialized');

      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      console.log('accounts', accounts);
      return { address: accounts[0], chainId: Number(network.chainId) };
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('MetaMask is not installed.');
  }
};

export const disconnectWallet = async () => {
  const response = await window.ethereum.request({
    method: 'wallet_revokePermissions',
    params: [{ eth_accounts: {} }],
  });
  console.log(response);
};
