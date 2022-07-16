import React, { useState } from "react";
// import { useTheme } from "@mui/material/styles";
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
import {
  BsFillPlayCircleFill /* BsFillPauseCircleFill */,
} from "react-icons/bs";
import { useStore } from "../store/store";

export default function SetupTask({ runningTask }) {
  // const theme = useTheme();
  // console.log(theme);

  const addTask = useStore((state) => state.tasks.addTask);
  const openSnackbar = useStore((state) => state.snackbar.openSnackbar);
  const [inputText, setInputText] = useState("");
  const isActiveOnly = useStore((state) => state.tasks.showActiveOnly);
  const toggleActiveOnly = useStore(
    (state) => state.tasks.toggleShowActiveOnly,
  );

  function resetInput() {
    setInputText("");
  }
  function handleInput(e) {
    setInputText(e.target.value);
  }

  function handleStart() {
    if (inputText) {
      addTask({
        name: inputText,
        timestamp: +new Date(),
        isActive: true,
      });
      resetInput();
      openSnackbar({ text: "Task started successfully" });
    } else {
    }
  }

  function handleEnterStart(e) {
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
