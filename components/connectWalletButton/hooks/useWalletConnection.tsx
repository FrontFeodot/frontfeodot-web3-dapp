'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetWallet,
  selectWallet,
  setWallet,
} from '@/store/slices/walletSlice';
import { connectWallet, disconnectWallet } from '@/lib/web3/connectWallet';

const useWalletConnection = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAppSelector(selectWallet);

  const handleConnect = async () => {
    console.log('handleConnect');
    const walletState = await connectWallet();
    if (!walletState) return;
    dispatch(setWallet(walletState));
  };

  const handleDisconnect = () => {
    disconnectWallet();
    dispatch(resetWallet());
  };

  return { address, isConnected, handleConnect, handleDisconnect };
};

export default useWalletConnection;
