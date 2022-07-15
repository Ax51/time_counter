import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Input,
  Divider,
} from "@mui/material";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsStopCircleFill,
} from "react-icons/bs";
import useTimer from "../ui-components/useTimer";
import timeRender from "../ui-components/TimeRender";
import { relativeToHumanTime } from "../utils/time";
import { useStore } from "../store/store";

export default function RenderTask({
  task: { id, name, isActive, isArchived, periods },
}) {
  const pauseTask = useStore((state) => state.tasks.pauseTask);
  const archiveTask = useStore((state) => state.tasks.archiveTask);
  const unarchiveTask = useStore((state) => state.tasks.unarchiveTask);
  const renameTask = useStore((state) => state.tasks.renameTask);

  const openSnackbar = useStore((state) => state.snackbar.openSnackbar);

  const [temporaryName, setTemporaryName] = useState(name);
  const [changeNameMode, setChangeNameMode] = useState(false);
  const [isRenderLast, setIsRenderLast] = useState(true);

  const { startTime: ms, endTime: lastTimeActive } =
    periods[periods.length - 1];

  const totalSpent = periods
    .filter((i) => i.endTime)
    .map((i) => i.endTime - i.startTime)
    .reduce((prev, cur) => prev + cur, 0);

  function saveNewName() {
    renameTask(id, temporaryName);
    setChangeNameMode(false);
  }

  function handleEnter(e) {
    if (e.key === "Enter") {
      saveNewName();
    }
  }

  function toggleShownTime() {
    if (isActive) {
      setIsRenderLast((prev) => !prev);
      openSnackbar({
        text: `Now task shows ${
          isRenderLast ? "current Timer" : "summary time"
        }`,
      });
    }
  }

  return (
    <Grid item xs={4}>
      <Card sx={{ minHeight: 200 }}>
        <CardContent>
          {changeNameMode ? (
            <Input
              value={temporaryName}
              onInput={(e) => setTemporaryName(e.target.value)}
              onKeyDown={handleEnter}
              onBlur={saveNewName}
              autoFocus
              fullWidth
            />
          ) : (
            <Typography
              variant="h5"
              align="center"
              onClick={() => setChangeNameMode(true)}
            >
              {name}
            </Typography>
          )}
          <Grid container alignItems="center" flexWrap="nowrap">
            <Grid>
              <Typography
                sx={{ color: !isActive && "text.disabled" }}
                onClick={toggleShownTime}
              >
                {useTimer({
                  ms: isRenderLast ? ms : ms - totalSpent,
                  name,
                  isActive,
                  lastTimeActive,
                  variant: isActive ? "shortStr" : "fullStr",
                })}
              </Typography>
            </Grid>
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
              const timeData = relativeToHumanTime(relativeTimeSpent);
              return (
                <Typography key={startTime}>
                  {`${k + 1})`}
                  {timeRender(timeData, "fullStr")}
                </Typography>
              );
            })}
          {!isActive && (
            <>
              <Divider sx={{ my: 1 }} />
              Total: {timeRender(relativeToHumanTime(totalSpent), "extendStr")}
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <button type="button" onClick={() => archiveTask(id)}>
            archive
          </button>
        </CardContent>
      </Card>
    </Grid>
  );
}
