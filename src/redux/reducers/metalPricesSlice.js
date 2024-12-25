import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gold: 2023.5,
  silver: 23.75,
  previousGold: null,
  previousSilver: null,
  lastUpdated: new Date().toISOString(),
};

const metalPricesSlice = createSlice({
  name: "metalPrices",
  initialState,
  reducers: {
    updatePrices: (state, action) => {
      state.previousGold = state.gold;
      state.previousSilver = state.silver;
      state.gold = action.payload.gold;
      state.silver = action.payload.silver;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { updatePrices } = metalPricesSlice.actions;
export const selectMetalPrices = (state) => state.metalPrices;

export default metalPricesSlice.reducer;
