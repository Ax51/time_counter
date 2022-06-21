import React from "react";
import { Grid, Card, CardContent, Typography, IconButton } from "@mui/material";
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import Timer from "./Timer";
import { relativeToHumanTime } from "../utils/time";
import { useStore } from "../store/store";

export default function RenderTask({ task: { id, name, isActive, periods } }) {
  const pauseTask = useStore((state) => state.tasks.pauseTask);
  const archiveTask = useStore((state) => state.tasks.archiveTask);

  const { startTime: ms, endTime: lastTimeActive } =
    periods[periods.length - 1];

  return (
    <Grid item xs={4}>
      <Card sx={{ minHeight: 200 }}>
        <CardContent>
          <Typography variant="h4" align="center">
            {name}
          </Typography>
          <Grid container alignItems="center" flexWrap="nowrap">
            {/* TODO: make switch between showing last timer and summary timer */}
            <Timer
              ms={ms}
              isActive={isActive}
              lastTimeActive={lastTimeActive}
            />
            <div>
              <IconButton
                color={isActive ? "secondary" : "primary"}
                size="large"
                onClick={() => pauseTask(id)}
              >
                {isActive ? (
                  <BsFillPauseCircleFill />
                ) : (
                  <BsFillPlayCircleFill />
                )}
              </IconButton>
            </div>
          </Grid>
          {periods
            .filter((i) => i.endTime)
            .reverse()
            .map(({ startTime, endTime }, k) => {
              const relativeTimeSpent = endTime - startTime;
              const { days, hours, minutes, seconds } =
                relativeToHumanTime(relativeTimeSpent);
              return +days > 0 ? (
                <Typography key={startTime}>
                  {`${k + 1}) ${days} Days, ${hours}:${minutes}:${seconds}`}
                </Typography>
              ) : (
                <Typography key={startTime}>{`${
                  k + 1
                }) ${hours}:${minutes}:${seconds}`}</Typography>
              );
            })}
          <button type="button" onClick={() => archiveTask(id)}>
            archive
          </button>
        </CardContent>
      </Card>
    </Grid>
  );
}
