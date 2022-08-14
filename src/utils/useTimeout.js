import { useEffect, useRef } from "react";

export function useTimeout(callback, delay = 1000) {
  if (!callback) {
    throw new Error("No callback given to useTimeout");
  }
  const timerIdRef = useRef(null);
  const savedCallbackRef = useRef();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      timerIdRef.current = setTimeout(savedCallbackRef.current, delay);
    } else {
      clearTimeout(timerIdRef.current);
    }
    return () => {
      clearTimeout(timerIdRef.current);
    };
  }, [delay]);
}

export function useInterval(callback, delay) {
  if (!callback) {
    throw new Error("No callback given to useTimeout");
  }
  const intervalIdRef = useRef(null);
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      intervalIdRef.current = setInterval(tick, delay);
    } else {
      clearInterval(intervalIdRef.current);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [delay]);
}
