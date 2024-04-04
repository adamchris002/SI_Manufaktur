import React from "react";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const MyLink = ({ text }) => {
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
              textDecoration: "none", // Hide default underline on hover
            },
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderBottom: "2px solid transparent", // Initial underline style
              transition: "border-color 0.3s ease-in-out", // Apply transition to border-color
            },
            "&:hover::after": {
              borderBottomColor: "#0F607D", // Change border color on hover
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Link>
        {text}
      </Link>
    </ThemeProvider>
  );
};

export default MyLink;
