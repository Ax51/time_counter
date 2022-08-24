import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import AnalogClock from "../ui-components/AnalogClock";
import { useTasksStore, useSnackbarStore } from "../store";
import { relativeToHumanTime, timeRender, useDailyRefresh } from "../utils";
import { persistStoreName } from "../config";

export default function Statistics() {
  const runningTask = useTasksStore((store) => store.runningTask());
  const todayMsTraced = useTasksStore((store) => store.getTodayActivity());
  const todayTracedObj = relativeToHumanTime(todayMsTraced);
  const weeklyTraced = useTasksStore((store) => store.getWeekActivity());
  const weeklyTracedObj = relativeToHumanTime(weeklyTraced);

  const openSnackbar = useSnackbarStore((store) => store.openSnackbar);

  useDailyRefresh();

  // TODO: move this somewhere
  function downloadHistory() {
    const link = document.createElement("a");
    link.download = `${persistStoreName}_history.json`;
    link.href = `data:text/json;charset=utf-8, ${encodeURIComponent(
      localStorage.getItem(persistStoreName) ?? "Error was occured",
    )}`;
    if (runningTask) {
      const confirmSave = window.confirm(
        `Active task found: ${runningTask.name}\nare you sure to save copy with running task?`,
      );
      if (confirmSave) {
        link.click();
      }
    } else {
      link.click();
    }
  }
  function rewriteHistory() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = 'accept="application/JSON"';
    input.oninput = () => {
      const file = input.files?.item(0);
      if (file) {
        const reader = new FileReader();
        const pageReload = () => document.location.reload();
        reader.readAsText(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            localStorage.setItem(persistStoreName, reader.result);
            pageReload();
          } else {
            openSnackbar({ text: "Incorrect file uploaded" });
          }
        };
      }
    };
    input.click();
  }

  return (
    <Card sx={{ width: "100%", minHeight: "100px", mb: 2 }}>
      <CardHeader
        title={
          <>
            {runningTask ? (
              <>
                Running task: <strong>{runningTask.name}</strong>
              </>
            ) : (
              "Statistics"
            )}
            <Divider sx={{ mt: 1 }} />
          </>
        }
        sx={{ textAlign: "center", pb: 0 }}
      />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              Today
            </Typography>
            <Typography sx={{ my: 3, borderBottom: 1 }}>
              Today we traced: <strong>{timeRender(todayTracedObj)}</strong>
            </Typography>
            <Typography sx={{ my: 3, borderBottom: 1 }}>
              This week we traced:
              <br />
              <strong>{timeRender(weeklyTracedObj, "daysToHours")}</strong>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              {runningTask ? "Actual timer" : "Clock"}
            </Typography>
            <AnalogClock trackActiveTask />
            {/* TODO: last active task controls */}
            Controls
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              Calendar
            </Typography>
            <Button variant="contained" onClick={downloadHistory}>
              Download history
            </Button>
            <Button variant="contained" onClick={rewriteHistory}>
              Upload history file
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
