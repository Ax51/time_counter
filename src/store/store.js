// DANGER: this is an old and unsafe version of the separated stores. use it only for reference

import create from "zustand";
// import { persist } from "zustand/middleware";
// import merge from "deepmerge";

import { createNewTask, resumePausedTask, stopRunningTask } from "./storeUtils";

// TODO: add zustand lens to separate stores
// TODO: split store to the separate stores and export each respectively
export const useStore = create(
  // persist( // comment this code because it conflicts with typed store
    (set, get) => ({
      tasks: {
        tasksArr: [],
        showActiveOnly: true,
        getTodayActivity: () =>
          get()
            .tasks.tasksArr.reduce((a, b) => {
              a.push(...b.periods);
              return a;
            }, [])
            .filter((i) => i.startTime > +new Date().setHours(0, 0, 0, 0))
            .reduce(
              (total, { startTime, endTime }) =>
                endTime ? total + (endTime - startTime) : total,
              0,
            ),
        getWeekActivity: () => {
          const now = new Date();
          now.setUTCHours(0, 0, 0, 0);
          now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
          const startOfThisWeek = +now;
          return get()
            .tasks.tasksArr.reduce((a, b) => {
              a.push(...b.periods);
              return a;
            }, [])
            .filter((i) => i.startTime > startOfThisWeek)
            .reduce(
              (total, { startTime, endTime }) =>
                endTime ? total + (endTime - startTime) : total,
              0,
            );
        },
        runningTask: () => get().tasks.tasksArr.find((task) => task.isActive),
        toggleShowActiveOnly: () =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              showActiveOnly: !state.tasks.showActiveOnly,
            },
          })),
        addTask: (givenData) =>
          set((state) => {
            const oldTasks = state.tasks.tasksArr.map((i) =>
              i.isActive ? stopRunningTask(i) : i,
            );
            const newTask = createNewTask(givenData);
            return {
              tasks: { ...state.tasks, tasksArr: [newTask, ...oldTasks] },
            };
          }),
        deleteTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.filter((i) => i.id !== id),
            },
          })),
        toggleDoneTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) => {
                // Found given task
                if (i.id === id) {
                  if (i.isActive) {
                    return {
                      ...stopRunningTask(i),
                      isDone: true,
                    };
                  }
                  return {
                    ...i,
                    isDone: !i.isDone,
                  };
                }
                return i;
              }),
            },
          })),
        pauseTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) => {
                // found last active task or selected task which is active now
                // and pause them
                if (i.isActive) {
                  return stopRunningTask(i);
                }
                // if we hasn't stop before, so this task is not active and,
                // if it's our task, so we can start it
                if (i.id === id) {
                  return resumePausedTask(i);
                }
                return i;
              }),
            },
          })),
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
        toggleArchiveTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) =>
                i.id === id
                  ? i.isActive
                    ? {
                      ...stopRunningTask(i),
                      isArchived: true,
                    }
                    : i.isArchived
                      ? { ...i, isArchived: false }
                      : { ...i, isArchived: true }
                  : i,
              ),
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
  //   {
  //     name: "time_counter",
  //     merge,
  //     version: 0,
  //   },
  // ),
);
