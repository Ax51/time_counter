import { useMemo } from "react";
import { createTheme, useMediaQuery } from "@mui/material";

export function useTheme() {
  const systemDarkTheme = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: systemDarkTheme ? "dark" : "light",
        },
      }),
    [systemDarkTheme],
  );
  return theme;
}
