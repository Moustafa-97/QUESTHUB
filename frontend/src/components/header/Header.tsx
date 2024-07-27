import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../Redux/Tools/ThemeMode";
import {
  AppBar,
  Box,
  CssBaseline,
  Fab,
  Fade,
  IconButton,
  Menu,
  Snackbar,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Light, Login, Logout, Person3 } from "@mui/icons-material";
import axios from "axios";
import { userData, userLogged } from "../../Redux/Tools/HandleUserLogin";

//
// interfaces
// ----------
interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

interface RootState {
  theme: {
    mode: string;
  };
}
interface State {
  Login: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      expPoints: number;
      level: number;
      theme: string;
    };
    logged: boolean;
  };
}

//
// start scroll to top function
// -----------------------
function ScrollTop(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

//
// end scroll to top function
// -----------------------

export default function Header(props: Props) {
  //
  // declarations
  // ------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogged = useSelector((state: State) => state.Login.logged);
  const loggedUser = useSelector((state: State) => state.Login.user);

  //
  // pages option declaration
  // -------------------------
  const pages = [
    isLogged ? "My Tasks" : null,
    isLogged ? "create" : null,
    isLogged ? (loggedUser.role === "admin" ? "settings" : null) : null,
  ];
  //
  // start "navbar settings MUI" burger menu
  //-----------------------------------------
  const [
    anchorElOption,
    setAnchorElOption,
  ] = React.useState<null | HTMLElement>(null);

  const handleOpenOptionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOption(event.currentTarget);
  };

  const handleCloseOptionMenu = () => {
    setAnchorElOption(null);
  };
  //
  // end "navbar settings MUI" burger menu
  //---------------------------------------

  //
  // start light/dark mode selection
  // --------------------------------
  const modeSelector = useSelector((state: RootState) => state.theme.mode);

  const handleMode = async () => {
    modeSelector === "dark"
      ? dispatch(setMode("light"))
      : dispatch(setMode("dark"));
  };

  //
  // end light/dark mode selection
  // ------------------------------
  //

  //
  // start handle logout
  // --------------------------------
  // states --->

  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const handleLogout = async () => {
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`)
      .then((res) => {
        if (res.status === 200) {
          setResMessage(res.data.message);
          dispatch(userData([]));
          dispatch(userLogged(false));
          setSnackOpen(true);
        }
      })
      .then(() => {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  //
  // end handle logout
  // ------------------------------
  //

  //
  //  mui snackbar settings
  // -----------------------
  const handleClose = (reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  //
  // end mui snackbar settings
  // -------------------------

  //
  // menu options handling
  // ----------------------
  const options = [
    // dark/light mode
    modeSelector === "dark" ? (
      <LightModeIcon
        id="lightMode"
        sx={{ cursor: "pointer" }}
        onClick={() => handleMode()}
      />
    ) : (
      <DarkModeIcon
        id="darkMode"
        sx={{ cursor: "pointer" }}
        onClick={() => handleMode()}
      />
    ),
    // profile
    isLogged ? (
      <Person3 id="profile" onClick={() => navigate("/profile")} />
    ) : null,
    // account settings
    isLogged ? (
      <Logout
        id="logout"
        titleAccess="logout"
        onClick={() => {
          handleLogout();
        }}
      />
    ) : (
      <Login
        id="login"
        titleAccess="login"
        onClick={() => navigate("/login")}
      />
    ),
  ];

  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <AppBar sx={{ px: 4 }}>
          <Toolbar disableGutters>
            {/* logo md */}
            <Typography
              onClick={() => navigate("/", { replace: true })}
              variant="body1"
              noWrap
              component="span"
              sx={{
                cursor: "pointer",
                mr: 2,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
              }}
            >
              <Light
                sx={{
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                  cursor: "pointer",
                }}
              />
              QUEST
              <Typography
                variant="body1"
                noWrap
                component="span"
                px={1}
                borderRadius={10}
                textAlign={"center"}
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  bgcolor: "orange",
                }}
              >
                HUB
              </Typography>
            </Typography>
            {/* menu xs */}

            {/* logo xs */}

            <Typography
              onClick={() => navigate("/", { replace: true })}
              variant="body1"
              noWrap
              component="span"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <Light sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              QUEST
              <Typography
                variant="body1"
                noWrap
                component="span"
                px={1}
                borderRadius={10}
                textAlign={"center"}
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  bgcolor: "orange",
                }}
              >
                HUB
              </Typography>
            </Typography>
            {/* menu md */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    navigate(`/${page?.toLowerCase().replace(" ", "")}`);
                    handleCloseOptionMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* options md & xs*/}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open Options">
                <IconButton onClick={handleOpenOptionMenu} sx={{ p: 1 }}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px", textAlign: "center" }}
                id="menu-appbar"
                anchorEl={anchorElOption}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElOption)}
                onClose={handleCloseOptionMenu}
              >
                {pages.map((page) => (
                  <MenuItem
                    sx={{ display: { xs: "block", md: "none" } }}
                    key={page}
                    onClick={() => {
                      navigate(`/${page?.toLowerCase().replace(" ", "")}`);
                      handleCloseOptionMenu();
                    }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                {options.map((option) => (
                  <MenuItem
                    sx={{
                      display: "block",
                      m: "auto",
                      textAlign: "center",
                      // width: "100%",
                    }}
                    key={Math.random()}
                    onClick={() => {
                      let id = option?.props.id;
                      if (id === "login") {
                        navigate("/login");
                      } else if (id === "logout") {
                        handleLogout();
                      } else if (id === "lightMode") {
                        handleMode();
                      } else if (id === "darkMode") {
                        handleMode();
                      } else if (id === "profile") {
                        navigate("/profile");
                      }

                      handleCloseOptionMenu();
                    }}
                  >
                    <Typography textAlign="center">{option}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        {/* the website children */}
        <Toolbar id="back-to-top-anchor" />
        <Box
          sx={{
            width: "100%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.children}
        </Box>
        <ScrollTop {...props}>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </React.Fragment>
      {/* snackbar */}
      <Snackbar
        message={resMessage}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackOpen}
        onClose={() => handleClose()}
      />
    </>
  );
}
