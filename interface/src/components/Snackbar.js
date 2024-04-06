import React from "react";
import { Snackbar, Slide, Alert } from "@mui/material";

function SlideUpTransition(props) {
    return <Slide {...props} direction="up" />;
  }

const MySnackbar = (props) => {
  const { open, handleClose, messageStatus, popupMessage } = props;
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUpTransition}
      autoHideDuration={6000}
    >
      <Alert
        onClose={handleClose}
        severity={messageStatus ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {popupMessage}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
