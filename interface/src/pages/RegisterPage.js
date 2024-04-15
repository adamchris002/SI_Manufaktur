import React, { useState } from "react";
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);
  const { setSuccessMessage } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);

  const [registerClicked, setRegisterClicked] = useState(false);

  const handleRegister = () => {
    const registerData = {
      name: name,
      username: username,
      email: email,
      password: password,
    };
    if (name === "" || username === "" || email === "" || password === "") {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill in all the required fields");
      setSnackbarStatus(false);
      setRegisterClicked(true);
    } else {
      axios({
        method: "POST",
        url: "http://localhost:3000/users/register",
        data: registerData,
      })
        .then((result) => {
          if (result.status === 200) {
            setSuccessMessage("You have successfully created an account!");
            setSnackbarStatus(true);
            navigate("/");
          }
        })
        .catch((error) => {
          if (error.response) {
            setOpenSnackbar(true);
            setSnackbarMessage(error.response.data.error);
            setSnackbarStatus(false);
          }
        });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(null);
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
        <div
          style={{
            marginTop: "64px",
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
              width: 512,
            }}
            error={registerClicked && name === ""}
            helperText={
              registerClicked && name === "" && "Please fill in your Name"
            }
            label="Name"
            variant="standard"
            onChange={(current) => {
              setName(current.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: registerClicked && name === "" ? "32px" :"64px" }}>
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
            error={registerClicked && username === ""}
            helperText={
              registerClicked &&
              username === "" &&
              "Please fill in your Username"
            }
            label="Username"
            variant="standard"
            onChange={(current) => {
              setUsername(current.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: registerClicked && name === "" ? "32px" :"64px" }}>
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
            error={registerClicked && email === ""}
            helperText={
              registerClicked && email === "" && "Please fill in your E-mail"
            }
            label="E-mail"
            variant="standard"
            onChange={(current) => {
              setEmail(current.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: registerClicked && name === "" ? "32px" :"64px" }}>
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
            error={registerClicked && password === ""}
            helperText={
              registerClicked &&
              password === "" &&
              "Please fill in your Password"
            }
            label="Password"
            variant="standard"
            onChange={(current) => {
              setPassword(current.target.value);
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
          <DefaultButton
            width="84px"
            height="42px"
            backgroundColor="#0F607D"
            borderRadius="10px"
            textTransform="uppercase"
            onClickFunction={handleRegister}
          >
            Register
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

export default RegisterPage;
