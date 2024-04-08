import React from "react";
import { TextField, MenuItem } from "@mui/material";

const MySelectTextField = (props) => {
  const { width, height, borderRadius, data } = props;
  return (
    <div>
      <TextField
        sx={{
          "& .MuiOutlinedInput-root": {
            height: height,
            width: width,
            fontSize: "24px",
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
      >
        {data.map((result) => {
          return <MenuItem value={result.value}>{result.label}</MenuItem>;
        })}
      </TextField>
    </div>
  );
};

export default MySelectTextField;
