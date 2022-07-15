import React from "react";
import { Grid, Box } from "@mui/material";
import { useStore } from "./store/store";
import SetupTask from "./components/SetupTask";
import RenderTask from "./components/RenderTask";
import Snackbar from "./utils/Snackbar";

export default function App() {
  const tasks = useStore((state) => state.tasks.tasksArr);
  const runningTask = tasks.find(
    (task) => task.periods.filter((period) => !period.endTime).length > 0,
  );
  const activeTasks = tasks.filter((i) => !i.isArchived);
  const showActiveOnly = useStore((state) => state.tasks.showActiveOnly);
  const renderTasksArr = showActiveOnly ? activeTasks : tasks;

  console.log("all tasks:", tasks);

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "grey.100" }}>
      <Box sx={{ p: 2 }}>
        <SetupTask runningTask={runningTask} />
        <Grid container spacing={2}>
          {renderTasksArr.map((i) => (
            <RenderTask key={i.id} task={i} />
          ))}
        </Grid>
      </Box>
      <Snackbar />
    </Box>
  );
}
