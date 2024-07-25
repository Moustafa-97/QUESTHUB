import { configureStore } from "@reduxjs/toolkit";
import ThemeMode from "../Tools/ThemeMode";
import SnackbarHandler from "../Tools/SnackbarHandler";
import HandleUserLogin from "../Tools/HandleUserLogin";
import HandleUserTasks from "../Tools/HandleUserTasks";
import HandleSection from "../Tools/ProfileSectionSelector";

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: {
    theme: ThemeMode,
    snackbar: SnackbarHandler,
    Login: HandleUserLogin,
    tasks: HandleUserTasks,
    selectedSection:HandleSection
  },
});
