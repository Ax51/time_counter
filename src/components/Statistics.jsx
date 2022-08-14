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
import { useActiveTask } from "../utils";

export default function Statistics() {
  const runningTask = useActiveTask();
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
            <AnalogClock />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              {runningTask ? "Actual timer" : "Clock"}
            </Typography>
            <AnalogClock trackActiveTask />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" textAlign="center">
              This Week
            </Typography>
            56
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
