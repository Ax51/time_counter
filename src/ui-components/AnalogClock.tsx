import { useMemo, useState, useEffect, useCallback } from "react";
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
import { useTasksStore } from "../store";
import { useInterval, relativeToHumanTime } from "../utils";

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type TColor = RGB | RGBA | HEX;

type TClockColor = {
  hands:
    | TColor
    | {
        second: TColor;
        minute: TColor;
        hour: TColor;
      };
  dial: TColor;
  hours: TColor;
  minutes: TColor;
  body: TColor;
  case: TColor;
  quarterHours: TColor;
  escapeWheel: TColor;
};

type TColorizableElement =
  | "hourHand"
  | "minuteHand"
  | "secondHand"
  | "dial"
  | "hours"
  | "minutes"
  | "body"
  | "escapeWheel"
  | "case"
  | "quarterHours";

interface IProps {
  trackActiveTask: boolean;
  lightTheme?: Partial<TClockColor>;
  darkTheme?: Partial<TClockColor>;
}

const timerTheme: TClockColor = {
  hands: {
    hour: "#61afff",
    minute: "#61afff",
    second: "#ee791a",
  },
  dial: "#4d4b63",
  hours: "#bdbdcb",
  minutes: "#a8f2e0",
  body: "#282828",
  escapeWheel: "#282828",
  case: "#282828",
  quarterHours: "#1df52f",
};

const clockTheme: TClockColor = {
  hands: {
    hour: "#61afff",
    minute: "#61afff",
    second: "#ee791a",
  },
  dial: "#4d4b63",
  hours: "#bdbdcb",
  minutes: "#a8f2e0",
  body: "#f5f5f5",
  escapeWheel: "#f5f5f5",
  case: "#dcdcdc",
  quarterHours: "#1df52f",
};

const useColor = (
  defaultTheme: TClockColor,
  customTheme?: Partial<TClockColor>,
) =>
  useCallback(
    (prop: TColorizableElement): TColor => {
      if (
        prop === "hourHand" ||
        prop === "minuteHand" ||
        prop === "secondHand"
      ) {
        if (typeof customTheme?.hands === "string") {
          return customTheme.hands;
        }
        const key = prop.replace("Hand", "") as "hour" | "minute" | "second";
        if (typeof customTheme?.hands === "object") {
          return customTheme.hands[key];
        }
        if (typeof defaultTheme.hands === "object") {
          return defaultTheme.hands[key];
        }
        return defaultTheme.hands;
      }
      return customTheme?.[prop] ?? defaultTheme[prop];
    },
    [customTheme, defaultTheme],
  );

export default function AnalogClock({
  trackActiveTask = false,
  lightTheme,
  darkTheme,
}: IProps) {
  const runningTask = useTasksStore((store) => store.runningTask());
  const clockMode = !trackActiveTask || !runningTask;

  const defaultTheme = clockMode ? clockTheme : timerTheme;
  const customTheme = clockMode ? lightTheme : darkTheme;
  const colorize = useColor(defaultTheme, customTheme);

  const colors = useMemo(
    () => ({
      hourHand: colorize("hourHand"),
      minuteHand: colorize("minuteHand"),
      secondHand: colorize("secondHand"),
      dial: colorize("dial"),
      hours: colorize("hours"),
      minutes: colorize("minutes"),
      body: colorize("body"),
      case: colorize("case"),
      quarterHours: colorize("quarterHours"),
      escapeWheel: colorize("escapeWheel"),
    } satisfies Record<TColorizableElement, string>),
    [colorize],
  );

  const [{ hourDeg, minuteDeg, secondDeg }, setHandsDeg] = useState({
    hourDeg: 0,
    minuteDeg: 0,
    secondDeg: 0,
  });

  const calcHandsDeg = useCallback(
    (hour: number, mins: number, secs: number) => ({
      hourDeg: (hour / 12) * 360 + (mins / 60) * 30 + 90,
      minuteDeg: (mins / 60) * 360 + (secs / 60) * 6 + 90,
      secondDeg: (secs / 60) * 360 + 90,
    }),
    [],
  );

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
        runningTask.periods[runningTask.periods.length - 1].startTime;
      const { hours, minutes, seconds } = relativeToHumanTime(spent);
      setHandsDeg(calcHandsDeg(+hours, +minutes, +seconds));
    }
  }, [clockMode, calcHandsDeg, runningTask?.periods]);

  useEffect(setupClock, [setupClock]);

  useInterval(setupClock, 500);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Clock
        size={200}
        color={colors.case}
        minutesColor={colors.minutes}
      >
        <OuterClockFace 
        color={colors.escapeWheel} hourColor={colors.quarterHours} 
        >
          <MarkOne color={colors.hours} />
          <MarkTwo  color={colors.hours}/>
          <MarkThree color={colors.hours} />
          <MarkFour color={colors.hours} />
          <InnerClockFace color={colors.body} dialColor={colors.dial} 
          >
            <HourHand
              color={colors.hourHand}
              sx={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <MinuteHand
              color={colors.minuteHand}
              sx={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <SecondHand
              color={colors.secondHand}
              sx={{ transform: `rotate(${secondDeg}deg)` }}
            />
          </InnerClockFace>
        </OuterClockFace>
      </Clock>
    </Grid>
  );
}
