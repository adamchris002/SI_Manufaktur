import React, { useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MyLink from "../components/Link";
import DefaultButton from "../components/Button";
import "@fontsource/roboto/300.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        overflow: "hidden", // Prevent scrolling and zooming
        position: "relative", // Needed for child element positioning
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 64,
          width: "232",
          height: "232",
        }}
      >
        <img
          style={{ width: "inherit", height: "inherit" }}
          src={companyLogo}
          alt="Company Logo"
        />
      </div>
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
            label="Username"
            variant="standard"
          />
        </div>
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
            label="Password"
            variant="standard"
            type={showPassword ? "password" : "text"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div
          onClick={() => {
            navigate("/register");
          }}
          style={{ marginTop: "48px" }}
        >
          <MyLink text={"Don't have an account yet? Register here!"} />
          <div style={{ marginTop: "48px" }}>
            <DefaultButton
              width="84px"
              height="42px"
              backgroundColor="#0F607D"
              borderRadius="10px"
              textTransform="uppercase"
            >
              Login
            </DefaultButton>
          </div>
          <div style={{marginTop: "156px"}}>
          <MyLink text={"Forgot Password?"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
