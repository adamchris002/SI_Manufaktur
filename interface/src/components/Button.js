import React, { useState } from "react";
import { Button } from "@mui/material";

const DefaultButton = (props) => {
  const {
    children,
    width,
    height,
    borderRadius,
    onClickFunction,
    textTransform,
    fontSize
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div>
      <Button
        style={{
          width: width, //default: 84px
          height: height, //default: 42px
          backgroundColor: isHovered ? "#0F607D" : "",
          color: isHovered ? "white" : "#0F607D",
          borderColor: "#0F607D",
          borderRadius: borderRadius,
          textTransform: textTransform || "none",
          fontSize: fontSize
        }}
        variant="outlined"
        onClick={onClickFunction}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Button>
    </div>
  );
};

export default DefaultButton;
