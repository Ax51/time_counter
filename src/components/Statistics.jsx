import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import AnalogClock from "../ui-components/AnalogClock";
import { useStore } from "../store";
import { relativeToHumanTime, timeRender, useDailyRefresh } from "../utils";

export default function Statistics() {
  const runningTask = useStore((store) => store.tasks.runningTask());
  const todayMsTraced = useStore((store) => store.tasks.getTodayActivity());
  const todayTracedObj = relativeToHumanTime(todayMsTraced);
  const weeklyTraced = useStore((store) => store.tasks.getWeekActivity());
  const weeklyTracedObj = relativeToHumanTime(weeklyTraced);

  useDailyRefresh();

  return (
    <Card sx={{ width: "100%", minHeight: "100px", mb: 2 }}>
      <CardHeader
        title={
          <>
            Statistics
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
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              Calendar
            </Typography>
            56
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
