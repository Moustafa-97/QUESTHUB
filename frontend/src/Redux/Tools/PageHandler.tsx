import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
};
const WishlistandWatchlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    RefreshPage: (state, action) => {
      state.page = action.payload;
    },
  },
});
export const { RefreshPage } = WishlistandWatchlist.actions;

export default WishlistandWatchlist.reducer;
