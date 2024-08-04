/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { Grid, OutlinedInput, Snackbar } from "@mui/material";
import Link from "@mui/material/Link";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userData, userLogged } from "../../Redux/Tools/HandleUserLogin";
import { useDispatch } from "react-redux";
import ButtonComp from "../../components/Buttons/ButtonComp";

interface response {
  data: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      theme: string;
      role: string;
      expPoints: number;
      level: number;
    };
    message: string;
    state: boolean;
  };
}

interface State {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export default function Login() {
  //
  // declarations
  // -------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  // login state
  // ------------
  const [userLogin, setUserLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  //
  // states
  // ------
  // snakbar status
  const [snackOpen, setSnackOpen] = useState(false);
  // snakbar message
  const [resMessage, setResMessage] = useState("");
  // password values
  const [values, setValues] = React.useState<State>({
    showPassword: false,
    showConfirmPassword: false,
  });

  //
  // handle input changes
  // ---------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUserLogin((prev) => {
      return { ...prev, [name]: value };
    });
  };

  //
  // handle submitting
  // ------------------
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const { email, password } = userLogin;
    e.preventDefault();

    if (email && password) {
      axios
        .post(
          `${import.meta.env.VITE_API_BASE_URL}/user/login`,
          // endPoints
          // ---------
          { currentUser: userLogin },
          // cookies::
          { withCredentials: true }
        )
        .then(async (res: response) => {
          //
          // handle response options
          // ----------------------
          dispatch(userData(res.data.user));
          dispatch(userLogged(true));
          setResMessage(res.data.message);
          setSnackOpen(true);
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setResMessage("server Error");
          setSnackOpen(true);
        });
    } else {
      setSnackOpen(true);
    }
  };

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
  //  handle show password function
  // ------------------------------
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      {/* Login form */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          maxHeight: "100vh",
          m: "auto",
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: "100%",
          }}
        >
          <Box
            onSubmit={(e: React.FormEvent<HTMLFormElement>): Promise<void> =>
              handleSubmit(e)
            }
            component="form"
            noValidate
            sx={{
              width: "80%",
              m: "auto",
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* email input field */}
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Email"
              placeholder="Email"
              type="email"
              name="email"
              value={userLogin.email}
              onChange={handleChange}
            />
            {/* password input field */}
            <OutlinedInput
              required
              fullWidth
              placeholder="password"
              id="outlined-password-input"
              type={values.showPassword ? "text" : "password"}
              name="password"
              value={userLogin.password}
              onChange={handleChange}
              endAdornment={
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              }
            />
            {/* login button */}
            <ButtonComp
              content="LOGIN"
              icon={null}
              mdFont={20}
              xsFont={10}
              onClick={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
            />
            {/* snackbar handler */}
            {userLogin.email && userLogin.password ? (
              <Snackbar
                message={resMessage}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackOpen}
                onClose={() => handleClose()}
              />
            ) : (
              <Snackbar
                message={"Please fill out all fields"}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackOpen}
                onClose={() => handleClose()}
              />
            )}
            {/* dont have an account handler */}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Link
                  href="/signup"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    ":hover": { fontWeight: "600" },
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link
                  href="/forget-password"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    ":hover": { fontWeight: "600" },
                  }}
                >
                  {"Forgot your password"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const IconButton = styled(Button)(
  ({ theme }) => `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: inherit;
  cursor: pointer;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[700]};
  `
);
