import React from "react";
import { TextField, MenuItem } from "@mui/material";

const MySelectTextField = (props) => {
  const { width, height, borderRadius, data, onChange, type, value } = props;
  return (
    <TextField
      type={type}
      value={value}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: height,
          width: width,
          fontSize: "1.5vw",
          borderRadius: borderRadius,
          "& fieldset": {
            borderColor: "#0F607D", // Change the border color here
          },
          "&:hover fieldset": {
            borderColor: "#0F607D", // Change the border color on hover here
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0F607D", // Change the border color when focused here
          },
        },
      }}
      select
      onChange={onChange}
    >
      {data.map((result) => {
        return <MenuItem value={result.value}>{result.value}</MenuItem>;
      })}
    </TextField>
  );
};

export default MySelectTextField;
