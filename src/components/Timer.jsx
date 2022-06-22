import React, { useRef, useReducer, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import { relativeToHumanTime } from "../utils/time";

export default function Timer({ ms, isActive, lastTimeActive }) {
  const msTimeLeft = lastTimeActive ? lastTimeActive - ms : +new Date() - ms;
  const { days, hours, minutes, seconds } = relativeToHumanTime(msTimeLeft);
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
      {isActive ? (
        <Typography>
          {!!+days && ` ${days} Days,`}
          {!!+hours && ` ${hours} hr,`}
          {!!+minutes && ` ${minutes} min,`}
          {seconds && ` ${seconds} sec`}
          {/* {+daysLeft > 0
              ? `${daysLeft} Days, ${hoursLeft}:${minsLeft}:${secsLeft}`
              : `${hoursLeft}:${minsLeft}:${secsLeft}`} */}
        </Typography>
      ) : (
        <Typography sx={{ color: "text.disabled" }}>00 sec</Typography>
      )}
    </Grid>
  );
}
