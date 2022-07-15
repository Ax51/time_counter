import React, { useRef, useReducer, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import { relativeToHumanTime } from "../utils/time";
import timeRender from "./TimeRender";

export default function Timer({ ms, name, isActive, lastTimeActive }) {
  const msTimeLeft = lastTimeActive ? lastTimeActive - ms : +new Date() - ms;
  const { days, hours, minutes, seconds } = relativeToHumanTime(msTimeLeft);
  const forceUpdate = useReducer((state) => state + 1, 0)[1];
  const timerIdRef = useRef(null);
  const titleStoreRef = useRef(document.title);

  function changeTitle(newTitle) {
    if (newTitle) {
      document.title = newTitle;
    } else {
      document.title = titleStoreRef.current;
    }
  }

  useEffect(() => {
    if (isActive) {
      const nameForTitle = name.slice(0, 7);
      changeTitle(
        +hours
          ? `${hours}:${minutes} - ${nameForTitle}`
          : `${minutes}:${seconds} - ${nameForTitle}`,
      );
    } else {
      changeTitle();
    }
  });

  useEffect(() => {
    if (isActive) {
      timerIdRef.current = setInterval(() => forceUpdate(), 1000);
    } else {
      clearInterval(timerIdRef.current);
    }
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [isActive, forceUpdate]);

  return (
    <Grid>
      {isActive ? (
        <Typography>
          {timeRender({ days, hours, minutes, seconds }, "fullStr")}
        </Typography>
      ) : (
        <Typography sx={{ color: "text.disabled" }}>00 sec</Typography>
      )}
    </Grid>
  );
}
