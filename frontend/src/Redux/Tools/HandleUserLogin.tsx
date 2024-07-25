/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  logged: false,
};

const HandleUserLogin = createSlice({
  name: "handleUserLogin",
  initialState,
  reducers: {
    userData: (state, action) => {
      state.user = action.payload;
    },
    userLogged: (state, action) => {
      state.logged = action.payload;
    },
  },
});

export const { userData, userLogged } = HandleUserLogin.actions;
export default HandleUserLogin.reducer;
