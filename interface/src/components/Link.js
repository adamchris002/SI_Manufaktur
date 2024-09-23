import React from "react";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const MyLink = (props) => {
  const {text, onClickFunction} = props
  const theme = createTheme({
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: "#0F607D",
            position: "relative",
            cursor: "pointer",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "none", 
            },
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderBottom: "2px solid transparent", 
              transition: "border-color 0.3s ease-in-out", 
            },
            "&:hover::after": {
              borderBottomColor: "#0F607D", 
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Link onClick={onClickFunction}>
        {text}
      </Link>
    </ThemeProvider>
  );
};

export default MyLink;
