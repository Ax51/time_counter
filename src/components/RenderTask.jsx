import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Input,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsStopCircleFill,
  BsClockHistory,
  BsClock,
} from "react-icons/bs";
import { MdArchive, MdUnarchive, MdDeleteForever } from "react-icons/md";
import { HiClipboardCheck, HiClipboardList } from "react-icons/hi";
import useTimer from "../ui-components/useTimer";
import { relativeToHumanTime, useTimeout, timeRender } from "../utils";
import { useTasksStore, useSnackbarStore } from "../store";

export default function RenderTask({
  task: { id, name, isActive, isDone, isArchived, periods },
}) {
  const pauseTask = useTasksStore((state) => state.pauseTask);
  const toggleArchiveTask = useTasksStore((state) => state.toggleArchiveTask);
  const renameTask = useTasksStore((state) => state.renameTask);
  const toggleDoneTask = useTasksStore((state) => state.toggleDoneTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  const openSnackbar = useSnackbarStore((state) => state.openSnackbar);

  const [temporaryName, setTemporaryName] = useState(name);
  const [changeNameMode, setChangeNameMode] = useState(false);
  const [isRenderLast, setIsRenderLast] = useState(true);
  const [showWarnSnackbar, setShowWarnSnackbar] = useState(false);

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
    openSnackbar({
      text: `Now task shows ${isRenderLast ? "summary time" : "current Timer"}`,
    });
    setIsRenderLast((prev) => !prev);
  }

  function howToDelete() {
    setShowWarnSnackbar(true);
  }

  function handleDeleteTask(e) {
    if (e.shiftKey) {
      setShowWarnSnackbar(false);
      deleteTask(id);
      openSnackbar({
        text: "Task permanently deleted",
      });
    }
  }

  useTimeout(
    () => {
      openSnackbar({
        text: "To permanently remove task you need to Shift + double click on icon",
        severity: "warning",
      });
      setShowWarnSnackbar(false);
    },
    showWarnSnackbar ? 1000 : null,
  );

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
              sx={{
                textDecoration: isDone ? "line-through" : "",
                color: "success.light",
              }}
            >
              <Box component="span" sx={{ color: "text.primary" }}>
                {name}
              </Box>
            </Typography>
          )}
          <Grid container alignItems="center" flexWrap="nowrap">
            <Grid>
              <Typography sx={{ color: !isActive && "text.disabled" }}>
                {/* {isActive && (isRenderLast ? "Active: " : "Total: ")} */}
                {isActive && (
                  <IconButton color="primary" onClick={toggleShownTime}>
                    {isRenderLast ? <BsClockHistory /> : <BsClock />}
                  </IconButton>
                )}
                {useTimer({
                  ms: isActive ? (isRenderLast ? ms : ms - totalSpent) : ms,
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
                onClick={() =>
                  isArchived ? toggleArchiveTask(id) : pauseTask(id)
                }
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
          <Tooltip
            title={isDone ? "Mark Task as incomplete" : "Mark Task as done"}
          >
            <IconButton
              sx={{ color: "#34d53d" }}
              onClick={() => toggleDoneTask(id)}
            >
              {isDone ? <HiClipboardList /> : <HiClipboardCheck />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isArchived ? "Unarchive Task" : "Archive Task"}>
            <IconButton
              onClick={() => toggleArchiveTask(id)}
              sx={{ color: "#ffc300" }}
            >
              {isArchived ? <MdUnarchive /> : <MdArchive />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Permanently delete Task">
            <IconButton
              color="error"
              onClick={howToDelete}
              onDoubleClick={handleDeleteTask}
            >
              <MdDeleteForever />
            </IconButton>
          </Tooltip>
        </CardContent>
      </Card>
    </Grid>
  );
}
