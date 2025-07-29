import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface SwapState {
  tokenInName: string;
  tokenOutName: string;
  amountInString: string;
}

const initialState: SwapState = {
  tokenInName: '',
  tokenOutName: '',
  amountInString: '',
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setTokenInName: (state, action) => {
      state.tokenInName = action.payload;
    },
    setTokenOutName: (state, action) => {
      state.tokenOutName = action.payload;
    },
    setAmountInString: (state, action) => {
      state.amountInString = action.payload;
    },
    resetSwapState: (state) => {
      state = initialState;
    },
  },
});

export const {
  setTokenInName,
  setTokenOutName,
  setAmountInString,
  resetSwapState,
} = swapSlice.actions;

export const selectTokenInName = (state: RootState) => state.swap.tokenInName;
export const selectTokenOutName = (state: RootState) => state.swap.tokenOutName;
export const selectAmountInString = (state: RootState) =>
  state.swap.amountInString;

export const selectIsTokenSelected =
  (tokenName: string) => (state: RootState) =>
    state.swap.tokenInName === tokenName ||
    state.swap.tokenOutName === tokenName;

export default swapSlice.reducer;
