import React from "react";
import { Grid, Box, ThemeProvider, CssBaseline } from "@mui/material";
import { useTasksStore } from "./store";
import SetupTask from "./components/SetupTask";
import RenderTask from "./components/RenderTask";
import Statistics from "./components/Statistics";
import { useTheme } from "./theme";
import { Snackbar } from "./utils";

export default function App() {
  // TODO: move all tasks render method to the
  // separate component an clear App component
  const renderTasksArr = useTasksStore((store) => store.tasksToRender());

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
          <Grid container spacing={2}>
            {renderTasksArr.map((i) => (
              <RenderTask key={i.id} task={i} />
            ))}
          </Grid>
        </Box>
        <Snackbar />
      </Box>
    </ThemeProvider>
  );
}
