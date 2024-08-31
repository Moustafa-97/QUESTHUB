/* eslint-disable @typescript-eslint/no-unused-vars */
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

//
// interfaces
// ----------

interface State {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export default function Signup() {
  //
  // declarations
  // -------------
  const navigate = useNavigate();

  //
  // manage states
  // --------------
  // 1)new user state
  //
  const [newUser, setNewUser] = useState<{
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>({
    firstName: "",
    lastName: "",
    image: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  //
  // 2)message snackbar
  //

  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");
  //
  // handle input change function
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    const { firstName, lastName, email, password, confirmPassword } = newUser;
    e.preventDefault();
    if (firstName && lastName && email && password && confirmPassword) {
      if (password === confirmPassword) {
        axios
          .post(`${import.meta.env.VITE_API_BASE_URL}/user/signup`, {
            newUser: newUser,
          })
          .then(async (res) => {
            if (res.status === 200) {
              setResMessage(await res.data.message);
              setSnackOpen(true);
              setTimeout(() => {
                navigate("/login", { replace: true });
              }, 2000);
            }
          })
          .catch((err) => console.log(err.response.data));
      } else {
        setResMessage("password did not match");
        setSnackOpen(true);
      }
    } else {
      setResMessage("please fill all fields");
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
  // end mui snackbar settings
  // -------------------------

  const [values, setValues] = React.useState<State>({
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      {/* Signup form */}
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
            m: "auto",
          }}
        >
          <Box
            onSubmit={(e: any): void => handleSubmit(e)}
            component="form"
            noValidate
            sx={{
              width: { md: "60%", xs: "80%" },
              height: "100%",
              m: "auto",
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              required
              id="outlined-required"
              type="text"
              label="First Name"
              placeholder="First Name"
              name="firstName"
              value={newUser.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Last Name"
              placeholder="Last Name"
              name="lastName"
              value={newUser.lastName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Email"
              placeholder="Email"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
            />
            <OutlinedInput
              required
              fullWidth
              id="outlined-adornment-password"
              placeholder="password"
              type={values.showPassword ? "text" : "password"}
              name="password"
              value={newUser.password}
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
            <OutlinedInput
              required
              fullWidth
              placeholder="Confirm Password"
              id="outlined-password-input"
              type={values.showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showConfirmPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={(e: any) => handleSubmit(e)}
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Sign Up
            </Button>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Link
                  href="/login"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    ":hover": { fontWeight: "600" },
                  }}
                >
                  {"You have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

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
