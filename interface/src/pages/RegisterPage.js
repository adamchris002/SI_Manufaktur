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
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

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
          zIndex: 1,
          position: "fixed",
          top: 64,
          left: 64,
          width: "128px",
          height: "128px",
        }}
      >
        <img
          style={{ width: "128px", height: "128px" }}
          src={companyLogo}
          alt="Company Logo"
        />
      </div>
      <div style={{ paddingTop: "128px" }}>
        <Typography
          style={{ color: "#0F607D", fontSize: 72, fontWeight: "regular" }}
        >
          Register
        </Typography>
        <Typography
          style={{
            marginTop: "48px",
            fontSize: 28,
            fontWeight: "regular",
            color: "#676767",
          }}
        >
          Hello there! Kindly fill in your information
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
            label="Name"
            variant="standard"
            onChange={(e) => {setName(e.target.value)}}
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
            label="Username"
            variant="standard"
            onChange={(e) => {setUsername(e.target.value)}}
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
            label="E-mail"
            variant="standard"
            onChange={(e) => {setEmail(e.target.value)}}
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
            onChange={(e) => {setPassword(e.target.value)}}
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
        <div
          onClick={() => {
            navigate("/");
          }}
          style={{ marginTop: "30px" }}
        >
          <MyLink text={"Already have an account? sign in here"} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
