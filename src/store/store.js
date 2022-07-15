/* eslint-disable prettier/prettier */
import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import merge from "deepmerge";

const taskInitialState = {
  id: String(),
  name: String(),
  timestamp: +new Date(),
  isActive: Boolean(),
  isArchived: Boolean(),
  periods: [
    { startTime: +new Date(), endTime: +new Date() },
    { startTime: +new Date(), endTime: null },
  ],
};

// TODO: add zustand lens to separate stores

export const useStore = create(
  persist(
    (set) => ({
      tasks: {
        tasksArr: [],
        showActiveOnly: true,
        toggleShowActiveOnly: () =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              showActiveOnly: !state.tasks.showActiveOnly,
            },
          })),
        addTask: (givenData) =>
          set((state) => {
            const oldTasks = state.tasks.tasksArr.map((i) => {
              const isTaskRunning =
                i.periods[i.periods.length - 1].endTime === null;
              const lastStartTime = i.periods[i.periods.length - 1].startTime;
              return isTaskRunning
                ? {
                  ...i,
                  isActive: false,
                  periods: [
                    ...i.periods.slice(0, -1),
                    { startTime: lastStartTime, endTime: +new Date() },
                  ],
                }
                : i;
            });
            const timestamp = givenData.timestamp ?? taskInitialState.timestamp;
            const newTask = {
              id: givenData.id ?? nanoid(10),
              name: givenData.name ?? taskInitialState.name,
              timestamp,
              isActive: givenData.isActive ?? taskInitialState.isActive,
              isArchived: false,
              periods: [{ startTime: timestamp, endTime: null }],
            };
            return {
              tasks: { ...state.tasks, tasksArr: [...oldTasks, newTask] },
            };
          }),
        deleteTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.filter((i) => i.id !== id),
            },
          })),
        pauseTask: (id) =>
          set((state) => {
            const taskIndex = state.tasks.tasksArr.findIndex(
              (i) => i.id === id,
            );
            const isNowActive = state.tasks.tasksArr[taskIndex].isActive;
            return {
              tasks: {
                ...state.tasks,
                tasksArr: state.tasks.tasksArr.map((i) => {
                  const lastStartTime =
                    i.periods[i.periods.length - 1].startTime;
                  const isTaskRunning =
                    i.periods[i.periods.length - 1].endTime === null;
                  // found last active task or selected task which is active now
                  // and pause them
                  if (isTaskRunning || (i.id === id && isNowActive)) {
                    const timeLeft = +new Date() - lastStartTime;
                    const isMoreThanMinute = timeLeft > 60000;
                    return {
                      ...i,
                      isActive: false,
                      // If last period is less than a minute, so squash it
                      // with last completed period
                      periods: isMoreThanMinute || i.periods.length < 2
                        ? [
                          ...i.periods.slice(0, -1),
                          { startTime: lastStartTime, endTime: +new Date() },
                        ]
                        : [
                          ...i.periods.slice(0, -2),
                          {
                            startTime:
                              i.periods[i.periods.length - 2].startTime,
                            endTime:
                              i.periods[i.periods.length - 2].endTime +
                              timeLeft,
                          },
                        ],
                    };
                  }
                  // found selected task if it's not active and start new period
                  if (i.id === id) {
                    return {
                      ...i,
                      isActive: true,
                      periods: [
                        ...i.periods,
                        { startTime: +new Date(), endTime: null },
                      ],
                    };
                  }
                  return { ...i, isActive: false };
                }),
              },
            };
          }),
        renameTask: (id, newName) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) =>
                i.id === id
                  ? {
                    ...i,
                    name: newName,
                  }
                  : i,
              ),
            },
          })),
        archiveTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) =>
                i.id === id
                  ? {
                    ...i,
                    isArchived: true,
                    periods: i.isActive
                      ? [
                        ...i.periods.slice(0, -1),
                        {
                          startTime:
                            i.periods[i.periods.length - 1].startTime,
                          endTime: +new Date(),
                        },
                      ]
                      : i.periods,
                    isActive: false,
                  }
                  : i,
              ),
            },
          })),
        unarchiveTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              showActiveOnly: true,
              tasksArr: state.tasks.tasksArr.map((i) => {
                const isTaskRunning =
                  i.periods[i.periods.length - 1].endTime === null;
                const lastStartTime = i.periods[i.periods.length - 1].startTime;
                if (isTaskRunning) {
                  return {
                    ...i,
                    isActive: false,
                    periods: [
                      ...i.periods.slice(0, -1),
                      {
                        startTime: lastStartTime,
                        endTime: +new Date(),
                      },
                    ],
                  };
                }
                if (i.id === id) {
                  return {
                    ...i,
                    isArchived: false,
                    periods: [
                      ...i.periods,
                      {
                        startTime: +new Date(),
                        endTime: null,
                      },
                    ],
                    isActive: true,
                  };
                }
                return i;
              }),
            },
          })),
      },
      snackbar: {
        props: {
          open: false,
          message: "",
          severity: "success",
          button: null,
        },
        closeSnackbar: () => {
          set((state) => ({
            snackbar: {
              ...state.snackbar,
              props: {
                ...state.snackbar.props,
                open: false,
              },
            },
          }));
        },
        openSnackbar: ({
          text: message = "",
          severity = "success",
          button,
          anchorOrigin = { vertical: "top", horizontal: "right" },
        }) => {
          set((state) => ({
            snackbar: {
              ...state.snackbar,
              props: {
                open: true,
                message,
                severity,
                button,
                anchorOrigin,
              },
            },
          }));
        },
      },
    }),
    {
      name: "time_counter",
      merge,
      version: 0,
    },
  ),
);
