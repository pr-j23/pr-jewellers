import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type MetalPricesState = {
  gold: number | null;
  silver: number | null;
  previousGold: number | null;
  previousSilver: number | null;
  lastUpdated: string;
};

const initialState: MetalPricesState = {
  gold: null,
  silver: null,
  previousGold: null,
  previousSilver: null,
  lastUpdated: new Date().toISOString(),
};

const metalPricesSlice = createSlice({
  name: 'metalPrices',
  initialState,
  reducers: {
    updatePrices: (state, action: PayloadAction<{ gold: number; silver: number }>) => {
      state.previousGold = state.gold;
      state.previousSilver = state.silver;
      state.gold = action.payload.gold;
      state.silver = action.payload.silver;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { updatePrices } = metalPricesSlice.actions;
export const selectMetalPrices = (state: RootState) => state.metalPrices;

export default metalPricesSlice.reducer;
