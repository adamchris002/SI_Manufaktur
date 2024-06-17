import { Chip } from "@mui/material";
import React, { useState } from "react";

const CustomChip = (props) => {
  const { text, width, height, fontSize } = props;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <Chip
      style={{
        width: width,
        height: height,
        color: isHovered ? "white" : "#0F607D",
        backgroundColor: isHovered ? "#0F607D" : "",
        borderColor: "#0F607D",
        fontSize: fontSize,
      }}
      label={text}
      variant="outlined"
      clickable
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default CustomChip;
