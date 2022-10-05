import React from "react";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import SetupTask from "./components/SetupTask";
import Statistics from "./components/Statistics";
import RenderAllTasks from "./components/RenderAllTasks";
import { useTheme } from "./theme";
import { Snackbar } from "./utils";

export default function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{ width: "100%", minHeight: "100%", bgcolor: "background.paper" }}
      >
        <Box sx={{ p: 2 }}>
          <SetupTask />
          <Statistics />
          <RenderAllTasks />
        </Box>
        <Snackbar />
      </Box>
    </ThemeProvider>
  );
}
