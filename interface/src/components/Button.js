import React from "react";
import { Button } from "@mui/material";

const DefaultButton = (props) => {
  const {
    children,
    width,
    height,
    backgroundColor,
    borderRadius,
    onClickFunction,
    textTransform,
  } = props;
  return (
    <div>
      <Button
        style={{
          width: width, //default: 84px
          height: height, //default: 42px
          backgroundColor: backgroundColor, //default : #0F607D
          borderRadius: borderRadius,
          textTransform: textTransform || "none",
        }}
        variant="contained"
        onClick={onClickFunction}
      >
        {children}
      </Button>
    </div>
  );
};

export default DefaultButton;
