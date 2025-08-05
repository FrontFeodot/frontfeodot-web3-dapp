import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Token } from '@/lib/web3/types/token.types';

export interface SwapState {
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountInString: string;
}

const initialState: SwapState = {
  tokenIn: null,
  tokenOut: null,
  amountInString: '',
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setTokenIn: (state, action) => {
      state.tokenIn = action.payload;
    },
    setTokenOut: (state, action) => {
      state.tokenOut = action.payload;
    },
    setAmountInString: (state, action) => {
      state.amountInString = action.payload;
    },
    resetSwapState: (state) => {
      state = initialState;
    },
  },
});

export const { setTokenIn, setTokenOut, setAmountInString, resetSwapState } =
  swapSlice.actions;

export const selectTokenIn = (state: RootState) => state.swap.tokenIn;
export const selectTokenOut = (state: RootState) => state.swap.tokenOut;
export const selectAmountInString = (state: RootState) =>
  state.swap.amountInString;

export default swapSlice.reducer;
