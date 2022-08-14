import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "@mui/material";
import {
  Clock,
  OuterClockFace,
  MarkOne,
  MarkTwo,
  MarkThree,
  MarkFour,
  InnerClockFace,
  HourHand,
  MinuteHand,
  SecondHand,
} from "./AnalogClockComponents";
import { useInterval, relativeToHumanTime, useActiveTask } from "../utils";

export default function AnalogClock({ trackActiveTask = false }) {
  const activeTask = useActiveTask();
  const clockMode = !trackActiveTask || !activeTask;
  const [{ hourDeg, minuteDeg, secondDeg }, setHandsDeg] = useState({
    hourDeg: 0,
    minuteDeg: 0,
    secondDeg: 0,
  });

  function calcHandsDeg(hour, mins, secs) {
    return {
      hourDeg: (hour / 12) * 360 + (mins / 60) * 30 + 90,
      minuteDeg: (mins / 60) * 360 + (secs / 60) * 6 + 90,
      secondDeg: (secs / 60) * 360 + 90,
    };
  }

  const setupClock = useCallback(() => {
    if (clockMode) {
      const now = new Date();
      const hour = now.getHours();
      const mins = now.getMinutes();
      const seconds = now.getSeconds();

      setHandsDeg(calcHandsDeg(hour, mins, seconds));
    } else {
      const spent =
        Date.now() -
        activeTask.periods[activeTask.periods.length - 1].startTime;
      const { hours, minutes, seconds } = relativeToHumanTime(spent);
      setHandsDeg(calcHandsDeg(hours, minutes, seconds));
    }
  }, [activeTask, clockMode]);

  useEffect(setupClock, [setupClock]);

  useInterval(setupClock, 500);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Clock
        size={200}
        sx={clockMode ? { bgcolor: "#a8f2e0", borderColor: "#dcdcdc" } : null}
      >
        <OuterClockFace sx={clockMode && { bgcolor: "#f5f5f5" }}>
          <MarkOne />
          <MarkTwo />
          <MarkThree />
          <MarkFour />
          <InnerClockFace sx={clockMode && { bgcolor: "#f5f5f5" }}>
            <HourHand sx={{ transform: `rotate(${hourDeg}deg)` }} />
            <MinuteHand sx={{ transform: `rotate(${minuteDeg}deg)` }} />
            <SecondHand sx={{ transform: `rotate(${secondDeg}deg)` }} />
          </InnerClockFace>
        </OuterClockFace>
      </Clock>
    </Grid>
  );
}
