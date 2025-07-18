import { getBrowserProvider } from '@/store/ethersProvider/ethersProvider';

export const connectWallet = async (connectedAccount?: string) => {
  if (window.ethereum) {
    try {
      const provider = getBrowserProvider();
      if (!provider) throw new Error('provider is not initialized');

      const account =
        connectedAccount || (await provider.send('eth_requestAccounts', []))[0];
      const network = await provider.getNetwork();

      return { address: account, chainId: Number(network.chainId) };
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('MetaMask is not installed.');
  }
};

export const disconnectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }
};
