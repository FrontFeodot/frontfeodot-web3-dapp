import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (
      state,
      {
        payload: { address, chainId },
      }: PayloadAction<Omit<WalletState, 'isConnected'>>
    ) => {
      state.address = address;
      state.chainId = chainId;
      state.isConnected = true;
    },
    resetWallet: (state) => {
      state.address = null;
      state.chainId = null;
      state.isConnected = false;
    },
  },
});

export const { setWallet, resetWallet } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet;

export default walletSlice.reducer;
