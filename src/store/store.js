import create from "zustand";
import { persist } from "zustand/middleware";
import merge from "deepmerge";

import { createNewTask, resumePausedTask, stopRunningTask } from "./storeUtils";

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
            const oldTasks = state.tasks.tasksArr.map((i) =>
              i.isActive ? stopRunningTask(i) : i,
            );
            const newTask = createNewTask(givenData);
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
        toggleDoneTask: (id) =>
          set((state) => ({
            tasks: {
              ...state.tasks,
              tasksArr: state.tasks.tasksArr.map((i) => {
                // Found given task
                if (i.id === id) {
                  // Check if it's active and now running
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
        // TODO: swtich to toggleArhiveTask
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
    {
      name: "time_counter",
      merge,
      version: 0,
    },
  ),
);
