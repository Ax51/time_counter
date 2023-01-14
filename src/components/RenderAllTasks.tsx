import { Grid } from "@mui/material";
import { useTasksStore } from "../store";
import RenderTask from "./RenderTask";

export default function RenderAllTasks() {
  const renderTasksArr = useTasksStore((store) => store.tasksToRender());

  return (
    <Grid container spacing={2}>
      {renderTasksArr.map((i) => (
        <RenderTask key={i.id} task={i} />
      ))}
    </Grid>
  );
}
