import { nanoid } from "nanoid";
import { Task, suggestedTask } from "./types";

export function stopRunningTask(task: Task) {
  const { periods } = task;
  const lastStartTime = periods[periods.length - 1].startTime;
  const timeLeft = Date.now() - lastStartTime;
  const isMoreThanMinute = timeLeft > 60000;
  return {
    ...task,
    isActive: false,
    // If last period is less than a minute, so squash it
    // with last completed period
    periods:
      isMoreThanMinute || periods.length < 2
        ? [
            ...periods.slice(0, -1),
            {
              startTime: lastStartTime,
              endTime: Date.now(),
            },
          ]
        : [
            ...periods.slice(0, -2),
            {
              startTime: periods[periods.length - 2].startTime,
              endTime: (periods[periods.length - 2].endTime ?? 0) + timeLeft,
            },
          ],
  };
}

export function resumePausedTask(task: Task) {
  return {
    ...task,
    isDone: false,
    isArchived: false,
    isActive: true,
    periods: [...task.periods, { startTime: Date.now(), endTime: null }],
  };
}

export function createNewTask({
  name,
  timestamp: ms,
  id,
  isActive,
  isArchived,
  isDone,
}: suggestedTask) {
  // NOTE: to use timestamp below twice, we need to create separate constant
  const timestamp = ms ?? Date.now();
  const newTask = {
    id: id ?? nanoid(10),
    name,
    timestamp,
    isActive: isActive ?? false,
    isDone: isDone ?? false,
    isArchived: isArchived ?? false,
    periods: [{ startTime: timestamp, endTime: null }],
  };
  return newTask;
}
