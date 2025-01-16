import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "./Login.css";
import MyLink from "../components/Link";
import DefaultButton from "../components/Button";
import "@fontsource/roboto/300.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import MySnackbar from "../components/Snackbar";
import { useAuth } from "../components/AuthContext";
import { AppContext } from "../App";

const LoginPage = (props) => {
  const { userCredentials, setUserCredentials } = props;

  const navigate = useNavigate();

  const { isMobile } = useContext(AppContext);

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
    const loginData = { username, password };
    if (username === "" || password === "") {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill in all the required fields");
      setSnackbarStatus(false);
      setLoginClicked(true);
    } else {
      setLoginClicked(true);
      axios.post("http://localhost:5000/users/login", loginData)
        .then((result) => {
          if (result.data === null || result.status === 401) {
            setOpenSnackbar(true);
            setSnackbarMessage("The username or password you entered is incorrect.");
            setSnackbarStatus(false);
          } else {
            if (result.data.department === null) {
              setOpenSnackbar(true);
              setSnackbarMessage("You have not been assigned a department yet. Please wait until one has been assigned to you.");
              setSnackbarStatus(false);
              setLoginClicked(true);
            } else {
              setUserCredentials(result);
              setSuccessMessage(`Successfully logged in, welcome back ${result.data.username}`);
              setSnackbarStatus(true);
              switch (result.data.department) {
                case "Marketing":
                  navigate("/marketingDashboard");
                  break;
                case "Production Planning":
                  navigate("/productionPlanningDashboard");
                  break;
                case "Inventory":
                  navigate("/inventoryDashboard");
                  break;
                case "Production":
                  navigate("/productionDashboard");
                  break;
                case "Finance":
                  navigate("/financeDashboard");
                  break;
                default:
                  setOpenSnackbar(true);
                  setSnackbarMessage("Sorry, it seems that you don't have a department yet");
                  setSnackbarStatus(false);
              }
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setOpenSnackbar(true);
            setSnackbarMessage("Username atau Password yang Anda masukkan tidak tepat");
            setSnackbarStatus(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarMessage("An unexpected error occurred. Please try again.");
            setSnackbarStatus(false);
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
        overflow: "auto",
        position: "relative",
      }}
      className="login-page"
    >
      <div
        style={{
          position: "fixed",
          top: 32,
          left: 32,
          width: "12vw",
          height: "12vw",
        }}
      >
        <img
          style={{ width: "inherit", height: "inherit" }}
          src={companyLogo}
          alt="Company Logo"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography
          style={{
            color: "#0F607D",
            fontSize: isMobile ? "12vw" : "5vw",
            fontWeight: "regular",
          }}
        >
          Sign in
        </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography
            style={{
              marginTop: "32px",
              fontSize: isMobile ? "5vw" : "2vw",
              fontWeight: "regular",
              color: "#676767",
            }}
          >
            Hello there! Sign in to your account
          </Typography>
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            type="text"
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
              width: isMobile ? "72vw" : "32vw",
            }}
            error={loginClicked && username === ""}
            helperText={
              loginClicked && username === "" && "Please fill in your Username"
            }
            label="Username"
            variant="standard"
            onChange={(current) => {
              handleInputUsername(current);
            }}
          />
        </div>
        <div
          style={{
            marginTop: "64px",
            display: "flex",
            justifyContent: "center",
          }}
        >
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
              width: isMobile ? "72vw" : "32vw",
            }}
            error={loginClicked && password === ""}
            helperText={
              loginClicked && password === "" && "Please fill in your Password"
            }
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
        <div style={{ marginTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MyLink
              onClickFunction={() => {
                navigate("/register");
              }}
              text={"Don't have an account yet? Register here!"}
            />
          </div>
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "center",
            }}
          >
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
          <div
            style={{
              margin: "32px 0px 32px 0px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MyLink onClickFunction={() => {
              navigate("/forgetPassword")
            }} text={"Forgot Password?"} />
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
