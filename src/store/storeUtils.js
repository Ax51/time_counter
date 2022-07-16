export function checkNewTaskPropertiesUtil(newTask, initialTask) {
  const newTaskAttrs = Object.keys(newTask);
  const initialTaskAttrs = Object.keys(initialTask);

  const newTaskLen = newTaskAttrs.length;
  const initialTaskLen = initialTaskAttrs.length;

  const mismatchedProperties = [...newTaskAttrs].filter(
    (attr) => initialTaskAttrs.indexOf(attr) === -1,
  );

  if (newTaskLen !== initialTaskLen) {
    console.error(
      "Check creating new task properties in store. Mismatch with initial task:",
      mismatchedProperties,
    );
  }
}

export function stopRunningTask(task) {
  const { periods } = task;
  const lastStartTime = periods[periods.length - 1].startTime;
  const timeLeft = +new Date() - lastStartTime;
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
            endTime: +new Date(),
          },
        ]
        : [
          ...periods.slice(0, -2),
          {
            startTime: periods[periods.length - 2].startTime,
            endTime: periods[periods.length - 2].endTime + timeLeft,
          },
        ],
  };
}

export function resumePausedTask(task) {
  return {
    ...task,
    isDone: false,
    isArchived: false,
    isActive: true,
    periods: [...task.periods, { startTime: +new Date(), endTime: null }],
  };
}
