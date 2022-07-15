import { useEffect, useRef } from "react";

export default function useTimeout(
  enableTimer,
  callback = () => {
    /** do nothing */
  },
  interval = 1000,
) {
  const timerIdRef = useRef(null);
  const savedCallbackRef = useRef();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (enableTimer) {
      timerIdRef.current = setTimeout(savedCallbackRef.current, interval);
    } else {
      clearTimeout(timerIdRef.current);
    }
    return () => {
      clearTimeout(timerIdRef.current);
    };
  }, [enableTimer, callback, interval]);
}
