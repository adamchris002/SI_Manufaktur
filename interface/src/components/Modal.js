import React from "react";
import { Backdrop } from "@mui/material";
import "./Modal.css";

const MyModal = (props) => {
  const { children, open } = props;
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div
        className="hideScrollbar"
          style={{
            // height: "40vw",
            // width: "60vw",
            backgroundColor: "white",
            borderRadius: "20px",
            overflow: "auto"
          }}
        >
          {children}
        </div>
      </Backdrop>
    </div>
  );
};

export default MyModal;
