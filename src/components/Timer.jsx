import React, { useRef, useReducer, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import { relativeToHumanTime } from "../utils/time";

export default function Timer({ ms, isActive, lastTimeActive }) {
  const msTimeLeft = lastTimeActive ? lastTimeActive - ms : +new Date() - ms;
  const {
    days: daysLeft,
    hours: hoursLeft,
    minutes: minsLeft,
    seconds: secsLeft,
  } = relativeToHumanTime(msTimeLeft);
  const forceUpdate = useReducer((state) => state + 1, 0)[1];
  const timerIdRef = useRef(null);

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
      <Typography>
        {+daysLeft > 0
          ? `${daysLeft} Days, ${hoursLeft}:${minsLeft}:${secsLeft}`
          : `${hoursLeft}:${minsLeft}:${secsLeft}`}
      </Typography>
    </Grid>
  );
}
