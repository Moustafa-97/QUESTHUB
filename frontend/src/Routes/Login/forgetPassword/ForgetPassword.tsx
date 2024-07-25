import { Box, Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
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
  const [forgetPassword, setForgetPassword] = useState<{ email: string }>();
  //
  // 2)message snackbar
  //

  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");

  //
  // functions
  // ---------
  //
  // handle input changes
  // ---------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForgetPassword((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //
  // handle submit
  //
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    const { email } = forgetPassword;
    e.preventDefault();
    if (email) {
      console.log(email);

      axios
        .post(
          `${import.meta.env.VITE_API_BASE_URL}/user/send-forget-pass-otp`,
          {
            forgetPassword: forgetPassword,
          }
        )
        .then(async (res) => {
          if (res.status === 200) {
            setResMessage(await res.data.message);
            setSnackOpen(true);
            setTimeout(() => {
              navigate("/otp", { replace: true });
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

  return (
    <>
      {/* forget password form */}
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
              label="Email"
              placeholder="Email"
              name="email"
              value={forgetPassword?.email}
              onChange={handleChange}
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
