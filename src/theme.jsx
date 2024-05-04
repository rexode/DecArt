import React from "react";
import { createTheme } from "@mui/material/styles";
import { lime, purple } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#4F3824",
      // dark: will be calculated from palette.primary.main,
    },
    background: {
      default: "#ede0d4",
    },
  },
  overrides: {},
});
