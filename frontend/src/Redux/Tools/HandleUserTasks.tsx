/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingTasks: [{}],
  completedTasks: [{}],
  incompletedTasks: [{}],
};

const HandleUserTasks = createSlice({
  name: "handleUserTasks",
  initialState,
  reducers: {
    userTasks: (state, action) => {
      state.pendingTasks = action.payload;
    },
    userCompletedTasks: (state, action) => {
      state.completedTasks = action.payload;
    },
    userIncomletedTasks: (state, action) => {
      state.incompletedTasks = action.payload;
    },
  },
});
export const {
  userTasks,
  userCompletedTasks,
  userIncomletedTasks,
} = HandleUserTasks.actions;
export default HandleUserTasks.reducer;
