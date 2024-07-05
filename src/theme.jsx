import React from "react";
import { createTheme } from "@mui/material/styles";
import { lime, purple } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#7f5539",
      secondary:"#9c6644"
      // dark: will be calculated from palette.primary.main,
    },
    background: {
      default: "#ede0d4",
    },
    typography: {
      useNextVariants: true,
      fontFamily: "Montserrat",
      h3: {
        color: "#482d0b",
        fontWeight: 300,


      }
    }
  
  },
  overrides: {},
});
