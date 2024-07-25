/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  section: "pending",
};

const HandleSection = createSlice({
  name: "handleSection",
  initialState,
  reducers: {
    handleSelection: (state, action) => {
      state.section = action.payload;
    },
  },
});
export const { handleSelection } = HandleSection.actions;
export default HandleSection.reducer;
