import React from "react";
import { TextField, MenuItem } from "@mui/material";

const MySelectTextField = (props) => {
  const {
    width,
    height,
    borderRadius,
    data,
    onChange,
    type,
    value,
    fontSize,
    disabled,
  } = props;
  return (
    <TextField
      disabled={disabled}
      type={type}
      value={value || ''}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: height,
          width: width,
          fontSize: fontSize,
          borderRadius: borderRadius,
          "& fieldset": {
            borderColor: "#0F607D", 
          },
          "&:hover fieldset": {
            borderColor: "#0F607D", 
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0F607D", 
          },
        },
      }}
      select
      onChange={onChange}
    >
      {data?.map((result, index) => {
        return (
          <MenuItem key={index} value={result.value}>
            {result.value}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default MySelectTextField;
