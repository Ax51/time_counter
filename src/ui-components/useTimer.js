import { useRef, useReducer, useEffect } from "react";
import { relativeToHumanTime } from "../utils/time";
import timeRender from "./TimeRender";

export default function useTimer({
  ms,
  name,
  isActive,
  lastTimeActive,
  variant,
}) {
  const msTimeLeft = lastTimeActive ? lastTimeActive - ms : Date.now() - ms;
  const { days, hours, minutes, seconds } = relativeToHumanTime(msTimeLeft);
  const forceUpdate = useReducer((state) => !state, 0)[1];
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
    return () => {
      changeTitle();
    };
  }, [hours, isActive, minutes, name, seconds]);

  useEffect(() => {
    if (isActive) {
      timerIdRef.current = setInterval(forceUpdate, 1000);
    } else {
      clearInterval(timerIdRef.current);
    }
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [isActive, forceUpdate]);

  return timeRender({ days, hours, minutes, seconds }, variant);
}
