import React from "react";
import { TextField, MenuItem } from "@mui/material";

const MySelectTextField = (props) => {
  const { width, height, borderRadius, data, onChange, type, value, fontSize } = props;
  return (
    <TextField
      type={type}
      value={value}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: height,
          width: width,
          fontSize: fontSize,
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
      {data?.map((result, index) => {
        return <MenuItem key={index} value={result.value}>{result.value}</MenuItem>;
      })}
    </TextField>
  );
};

export default MySelectTextField;
