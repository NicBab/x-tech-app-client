"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
