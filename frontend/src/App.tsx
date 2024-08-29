import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { createTheme, CssBaseline, PaletteMode } from "@mui/material";
import { blueGrey, grey, teal } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "./Redux/Tools/ThemeMode";
import MainApp from "./Routes/MainApp";
// for cookies::
import axios from "axios";
axios.defaults.withCredentials = true;

interface RootState {
  theme: {
    mode: PaletteMode;
  };
}

// dark mode control===>>
// 1) Modes Palette
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: grey,
          divider: grey[100],
          background: {
            default: grey[300],
            paper: grey[200],
          },
          text: {
            primary: grey[900],
            secondary: grey[500],
          },
        }
      : {
          // palette values for dark mode
          primary: blueGrey,
          divider: blueGrey[700],
          background: {
            default: blueGrey[900],
            paper: blueGrey[900],
          },
          text: {
            primary: "#fff",
            secondary: blueGrey[500],
          },
        }),
  },
});

function App() {
  // dark mode control===>>
  // 2) Modes Control
  const dispatch = useDispatch();
  // check if user's has changed mode before
  const modeHistory: string | null = localStorage.getItem("themeMode");
  // check user's device settings
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const prefersDarkMode = mediaQuery.matches;
  // import redux state
  const mode = useSelector((state: RootState) => state.theme.mode);
  // check if there is a history and Set mode first user's visit
  useEffect(() => {
    if (modeHistory) {
      dispatch(setMode(modeHistory));
    } else {
      prefersDarkMode ? dispatch(setMode("dark")) : dispatch(setMode("light"));
    }
  }, [dispatch, modeHistory, prefersDarkMode]);

  // Add mode to user's Browser's storage
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainApp />
      </ThemeProvider>
    </>
  );
}

export default App;
