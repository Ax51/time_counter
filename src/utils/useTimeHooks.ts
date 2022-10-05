import { useEffect, useRef, useReducer } from "react";

export function useTimeout(callback: () => void, delay: number | null = 1000) {
  if (!callback) {
    throw new Error("No callback given to useTimeout");
  }
  const timerIdRef = useRef<number | null>(null);
  const savedCallbackRef = useRef<() => void>();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null && savedCallbackRef.current) {
      timerIdRef.current = setTimeout(savedCallbackRef.current, delay);
    } else {
      clearTimeout(timerIdRef.current ?? 0);
    }
    return () => {
      clearTimeout(timerIdRef.current ?? 0);
    };
  }, [delay]);
}

export function useInterval(callback: () => void, delay: number | null) {
  if (!callback) {
    throw new Error("No callback given to useInterval");
  }
  const intervalIdRef = useRef<number | null>(null);
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      intervalIdRef.current = setInterval(tick, delay);
    } else {
      clearInterval(intervalIdRef.current ?? 0);
    }
    return () => clearInterval(intervalIdRef.current ?? 0);
  }, [delay]);
}

export function useDailyRefresh() {
  const forceUpdate = useReducer((state) => !state, true)[1];
  const next = new Date();
  next.setUTCHours(0, 0, 0, 0);
  next.setDate(next.getDate() + 1);

  const diffMs = +next - Date.now();

  useTimeout(forceUpdate, diffMs);
}
