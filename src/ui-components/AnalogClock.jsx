import React, { useState } from "react";
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
import { useInterval, relativeToHumanTime } from "../utils";

export default function AnalogClock({ ms, runningTask, fixedTime = false }) {
  const clockMode = !ms && !runningTask;
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

  useInterval(
    () => {
      if (ms || runningTask) {
        const spent =
          Date.now() -
          (ms || runningTask.periods[runningTask.periods.length - 1].startTime);
        const { hours, minutes, seconds } = relativeToHumanTime(spent);
        setHandsDeg(calcHandsDeg(hours, minutes, seconds));
      } else {
        const now = new Date();
        const hour = now.getHours();
        const mins = now.getMinutes();
        const seconds = now.getSeconds();

        setHandsDeg(calcHandsDeg(hour, mins, seconds));
      }
    },
    fixedTime ? null : 1000,
  );

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
        {/* {timeRender()} */}
      </Clock>
    </Grid>
  );
}
