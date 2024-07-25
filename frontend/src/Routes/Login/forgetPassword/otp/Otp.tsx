import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface State {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export default function Otp() {
  //
  // declarations
  //
  const navigate = useNavigate();

  //
  // manage states
  // --------------
  //
  // 1)forgetPassword
  //
  const [newPassword, setNewPassword] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  //
  // 2)message snackbar
  //
  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");

  // 3)password values
  const [values, setValues] = React.useState<State>({
    showPassword: false,
    showConfirmPassword: false,
  });

  //
  // functions
  // ---------
  //
  // handle input changes
  // ---------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };

  //
  // handle submit
  //
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { email, otp, password, confirmPassword } = newPassword;
    if (password !== confirmPassword) {
      setResMessage("Password and Confirm Password must be same");
      setSnackOpen(true);
    } else if (email && password && otp && confirmPassword) {
      axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/user/change-password`, {
          newPassword: newPassword,
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

  //
  //  handle show password function
  // ------------------------------
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
      {/* otp form */}
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
              width: "50%",
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
              label="OTP"
              placeholder="OTP"
              name="otp"
              value={newPassword?.otp}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              id="outlined-required"
              type="text"
              label="Email"
              placeholder="Email"
              name="email"
              value={newPassword?.email}
              onChange={handleChange}
            />

            {/* password input field */}
            <OutlinedInput
              required
              fullWidth
              placeholder="New Password"
              name="password"
              id="outlined-password-input"
              type={values.showPassword ? "text" : "password"}
              value={newPassword?.password}
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
              id="outlined-password-input"
              type={values.showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              name="confirmPassword"
              value={newPassword?.confirmPassword}
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
