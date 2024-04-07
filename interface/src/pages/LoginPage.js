import React, { useEffect, useState } from "react";
import axios from "axios";
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
import MySnackbar from "../components/Snackbar";
import { useAuth } from "../components/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);
  const { message, clearMessage, setSuccessMessage } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);

  const [loginClicked, setLoginClicked] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  const handleInputUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const loginData = { username: username, password: password };
    if (username === "" || password === "") {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill in all the required fields");
      setSnackbarStatus(false);
      setLoginClicked(true)
    } else {
      setLoginClicked(true)
      axios({
        method: "POST",
        url: "http://localhost:3000/users/login",
        data: loginData,
      }).then((result) => {
        if (result.data === null) {
          setOpenSnackbar(true);
          setSnackbarMessage(
            "The username or password you entered is incorrect."
          );
          setSnackbarStatus(false);
        } else {
          setSuccessMessage(
            `Successfully logged in, welcome back ${result.data.username}`
          );
          setSnackbarStatus(true);
          switch (result.data.department) {
            case "Marketing":
              navigate("/marketingDashboard");
              break;
            case "Production Planning":
              navigate("/productionPlanningDashboard");
              break;
            case "Inventory":
              navigate("inventoryDashboard");
              break;
            case "Production":
              navigate("productionDashboard");
              break;
            case "Waste":
              navigate("/wasteDashboard");
              break;
            default:
              setOpenSnackbar(true);
              setSnackbarMessage(
                "Sorry, it seems that you don't have a department yet"
              );
              setSnackbarStatus(false);
          }
        }
      });
    }
  };

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
            error={loginClicked && username === ""} // Show error only after clicking login
            helperText={(loginClicked && username === "") && ("Please fill in your Username")}
            label="Username"
            variant="standard"
            onChange={(current) => {
              handleInputUsername(current);
            }}
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
            error={loginClicked && password === ""} // Show error only after clicking login
            helperText={(loginClicked && password === "") && ("Please fill in your Password")}
            label="Password"
            variant="standard"
            onChange={(current) => {
              handleInputPassword(current);
            }}
            type={showPassword ? "password" : "text"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    style={{ height: "16px", width: "16px" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon
                        style={{ width: "16px", height: "auto" }}
                      />
                    ) : (
                      <VisibilityIcon
                        style={{ width: "16px", height: "auto" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ marginTop: "48px" }}>
          <MyLink
            onClickFunction={() => {
              navigate("/register");
            }}
            text={"Don't have an account yet? Register here!"}
          />
          <div style={{ marginTop: "48px" }}>
            <DefaultButton
              width="84px"
              height="42px"
              backgroundColor="#0F607D"
              borderRadius="10px"
              textTransform="uppercase"
              onClickFunction={handleLogin}
            >
              Login
            </DefaultButton>
          </div>
          <div style={{ marginTop: "156px" }}>
            <MyLink text={"Forgot Password?"} />
          </div>
        </div>
      </div>
      {snackbarMessage !== ("" || null) && (
        <MySnackbar
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          messageStatus={snackbarStatus}
          popupMessage={snackbarMessage}
        />
      )}
    </div>
  );
};

export default LoginPage;
