import { useRef, useReducer, useEffect } from "react";
import { relativeToHumanTime, timeRender } from "../utils";
import { Timer } from "../store/types";

export default function useTimer({
  ms,
  name,
  isActive,
  lastTimeActive,
  variant,
}: Timer) {
  const msTimeLeft = lastTimeActive ? lastTimeActive - ms : Date.now() - ms;
  const { days, hours, minutes, seconds } = relativeToHumanTime(msTimeLeft);
  const forceUpdate = useReducer((state) => !state, true)[1];
  const timerIdRef = useRef<number>();
  const titleStoreRef = useRef(document.title);

  function changeTitle(newTitle?: string) {
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
      // TODO: think about migrating from force update
      // to useState
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
