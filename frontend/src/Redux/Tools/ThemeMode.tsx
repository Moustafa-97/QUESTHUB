import { createSlice } from "@reduxjs/toolkit";

const modeHistory: string | null = localStorage.getItem("themeMode");
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const prefersDarkMode = mediaQuery.matches;

const initialState = {
  mode: modeHistory ? modeHistory : prefersDarkMode ? "dark" : "light",
};

// eslint-disable-next-line react-refresh/only-export-components
const ThemeMode = createSlice({
  name: "ThemeMode",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("themeMode", action.payload);
    },
  },
});

export const { setMode } = ThemeMode.actions;
export default ThemeMode.reducer;
