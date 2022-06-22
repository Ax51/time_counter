import React from "react";
import { Grid, Card, CardContent, Typography, IconButton } from "@mui/material";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsStopCircleFill,
} from "react-icons/bs";
import Timer from "./Timer";
import { relativeToHumanTime } from "../utils/time";
import { useStore } from "../store/store";

export default function RenderTask({
  task: { id, name, isActive, isArchived, periods },
}) {
  const pauseTask = useStore((state) => state.tasks.pauseTask);
  const archiveTask = useStore((state) => state.tasks.archiveTask);
  const unarchiveTask = useStore((state) => state.tasks.unarchiveTask);

  const { startTime: ms, endTime: lastTimeActive } =
    periods[periods.length - 1];

  return (
    <Grid item xs={4}>
      <Card sx={{ minHeight: 200 }}>
        <CardContent>
          <Typography variant="h5" align="center">
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
                color={
                  isArchived ? "error" : isActive ? "secondary" : "primary"
                }
                size="large"
                onClick={() => (isArchived ? unarchiveTask(id) : pauseTask(id))}
              >
                {isArchived ? (
                  <BsStopCircleFill />
                ) : isActive ? (
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
              return (
                <Typography key={startTime}>
                  {`${k + 1})`}
                  {!!+days && ` ${days} D.`}
                  {!!+hours && ` ${hours} hr`}
                  {!!+minutes && ` ${minutes} min`}
                  {seconds && ` ${seconds} sec`}
                  {/* {`${k + 1}) ${hours}:${minutes}:${seconds}`} */}
                </Typography>
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
