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
import timeRender from "../ui-components/TimeRender";
import { relativeToHumanTime } from "../utils/time";
import { useStore } from "../store/store";
import useTimeout from "../utils/useTimeout";

export default function RenderTask({
  task: { id, name, isActive, isDone, isArchived, periods },
}) {
  const pauseTask = useStore((state) => state.tasks.pauseTask);
  const toggleArchiveTask = useStore((state) => state.tasks.toggleArchiveTask);
  const renameTask = useStore((state) => state.tasks.renameTask);
  const toggleDoneTask = useStore((state) => state.tasks.toggleDoneTask);
  const deleteTask = useStore((state) => state.tasks.deleteTask);

  const openSnackbar = useStore((state) => state.snackbar.openSnackbar);

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

  function handleTaskDone() {
    toggleDoneTask(id);
  }

  useTimeout(
    showWarnSnackbar,
    () => {
      openSnackbar({
        text: "To permanently remove task you need to Shift + double click on icon",
        severity: "warning",
      });
      setShowWarnSnackbar(false);
    },
    500,
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
            {/* TODO: added the ability to mark task ready */}
            <IconButton sx={{ color: "#34d53d" }} onClick={handleTaskDone}>
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
