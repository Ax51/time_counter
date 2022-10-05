import React, { useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Input,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useTasksStore, useSnackbarStore } from "../store";
import { createNewTask } from "../store/storeUtils";

export default function SetupTask() {
  const [inputText, setInputText] = useState("");
  const openSnackbar = useSnackbarStore((state) => state.openSnackbar);
  const runningTask = useTasksStore((store) => store.runningTask());
  const addTask = useTasksStore((state) => state.addTask);
  const isActiveOnly = useTasksStore((state) => state.showActiveOnly);
  const toggleActiveOnly = useTasksStore((state) => state.toggleShowActiveOnly);

  function resetInput() {
    setInputText("");
  }
  function handleInput(e: React.BaseSyntheticEvent) {
    setInputText(e.target.value);
  }

  function handleStart() {
    if (inputText) {
      addTask(createNewTask({ name: inputText }));
      resetInput();
      openSnackbar({ text: "Task started successfully" });
    } else {
    }
  }

  function handleEnterStart(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleStart();
    }
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Card sx={{ minWidth: 350, minHeight: 80 }}>
        <CardContent sx={{ position: "relative" }}>
          <Typography
            variant="subtitle2"
            sx={{
              position: "absolute",
              top: (theme) => theme.spacing(1.5),
              left: (theme) => theme.spacing(2),
              color: "text.disabled",
            }}
          >
            {runningTask && `Traking task: ${runningTask.name}`}
          </Typography>
          <Typography variant="h4" align="center">
            Setup timer
          </Typography>
          <Grid container alignItems="center" flexWrap="nowrap">
            <Input
              sx={{ m: 1 }}
              fullWidth
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleEnterStart}
              placeholder="Enter here your task"
            />
            <div>
              <IconButton color="primary" size="large" onClick={handleStart}>
                <BsFillPlayCircleFill />
              </IconButton>
            </div>
            <FormControlLabel
              sx={{
                display: "block",
              }}
              control={
                <Switch
                  checked={!isActiveOnly}
                  onChange={toggleActiveOnly}
                  name="filter active tasks"
                  color="primary"
                />
              }
              label={isActiveOnly ? "Active tasks" : "All tasks"}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
