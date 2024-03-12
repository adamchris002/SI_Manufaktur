import React from "react";
import { Typography, TextField, Link, Button } from "@mui/material";
import "@fontsource/roboto/300.css";

const LoginPage = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div style={{ paddingTop: "128px" }}>
        <Typography
          style={{ color: "#0F607D", fontSize: 72, fontWeight: "regular" }}
        >
          Sign in
        </Typography>
        <Typography
          style={{
            marginTop: "48px",
            fontSize: 28,
            fontWeight: "regular",
            color: "#676767",
          }}
        >
          Hello there! Sign in to your account
        </Typography>
        <div style={{ marginTop: "64px" }}>
          <TextField
            sx={{
              "& label.Mui-focused": {
                color: "#0F607D",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#0F607D",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#0F607D",
              },
              width: 512,
            }}
            label="username"
            variant="standard"
          />
        </div>
        <div style={{ marginTop: "32px" }}>
          <TextField
            sx={{
              "& label.Mui-focused": {
                color: "#0F607D",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#0F607D",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#0F607D",
              },
              width: 512,
            }}
            label="password"
            variant="standard"
          />
        </div>
        <div style={{ marginTop: "48px" }}>
          <Link underline="hover" style={{ color: "#0F607D" }}>
            Don't have an account yet? Register here!
          </Link>
          <div style={{ marginTop: "48px" }}>
            <Button
              style={{
                width: "84px",
                height: "42px",
                backgroundColor: "#0F607D",
              }}
              variant="contained"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
