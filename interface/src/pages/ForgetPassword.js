import React, { useContext, useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AppContext } from "../App";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import MySnackbar from "../components/Snackbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DefaultButton from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ForgetPassword = () => {
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tempDataAccount, setTempDataAccount] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSearchUser = () => {
    if (username === "") {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill in all the required fields");
      setSnackbarStatus(false);
      setButtonClicked(true);
    } else {
      axios({
        method: "GET",
        url: `http://localhost:5000/users/getOneUser/${username}`,
      }).then((result) => {
        if (result.status === 200) {
          setTempDataAccount(result.data);
          setShowPasswordField(true);
          setOpenSnackbar(true);
          setSnackbarMessage("Akunmu tersedia");
          setSnackbarStatus(true);
          setButtonClicked(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarMessage("Akun tidak ditemukan");
          setSnackbarStatus(false);
        }
      });
    }
  };

  const handleResetPassword = () => {
    if (username === "" || password === "") {
      setButtonClicked(true);
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon mengisi username dan password baru");
    } else {
      axios({
        method: "PUT",
        url: "http://localhost:5000/users/forgetPassword",
        data: { username: username, password: password },
      }).then((result) => {
        if (result.status === 200) {
            setSuccessMessage("Berhasil mengubah password");
            setSnackbarStatus(true);
          navigate(-1);
        } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage("Tidak berhasil mereset password")
        }
      });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
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
          Reset Password
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography
            style={{
              marginTop: "32px",
              fontSize: isMobile ? "5vw" : "1.5vw",
              fontWeight: "regular",
              color: "#676767",
            }}
          >
            Silahkan mengisi username anda untuk memastikan anda memiliki akun
          </Typography>
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            error={buttonClicked && username === ""}
            helperText={
              buttonClicked && username === "" && "Please fill in your Username"
            }
            label="Username"
            variant="standard"
            onChange={(current) => {
              setUsername(current.target.value);
            }}
          />
          <IconButton
            onClick={() => {
              handleSearchUser();
            }}
            style={{ width: "48px", height: "48px", marginLeft: "16px" }}
          >
            <SearchIcon style={{ color: "#0f607d" }} />
          </IconButton>
        </div>
        {Object.keys(tempDataAccount).length !== 0 && (
          <>
            <div
              style={{
                marginTop: "32px",
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
                  width: isMobile ? "72vw" : "36vw",
                }}
                error={buttonClicked && password === ""}
                helperText={
                  buttonClicked &&
                  password === "" &&
                  "Please fill in your Password"
                }
                label="Password baru"
                variant="standard"
                onChange={(current) => {
                  setPassword(current.target.value);
                }}
                type={showPasswordField ? "password" : "text"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        style={{ height: "16px", width: "16px" }}
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPasswordField(!showPasswordField);
                        }}
                        edge="end"
                      >
                        {showPasswordField ? (
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
              <DefaultButton
                onClickFunction={() => {
                  handleResetPassword();
                }}
              >
                Reset Password
              </DefaultButton>
            </div>
          </>
        )}
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

export default ForgetPassword;
