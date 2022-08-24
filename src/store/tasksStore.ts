import create from "zustand";
import { persist } from "zustand/middleware";
import { stopRunningTask, resumePausedTask, createNewTask } from "./storeUtils";
import { Period, Store } from "./types";
import { persistStoreName, persistStoreVersion } from "../config";

export const useTasksStore = create<Store>()(
  persist(
    (set, get) => ({
      tasksArr: [],
      showActiveOnly: false,
      getTodayActivity: () =>
        get()
          .tasksArr.reduce((a: Period[], b) => {
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
        now.setDate(
          now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1),
        );
        const startOfThisWeek = +now;
        return get()
          .tasksArr.reduce((a: Period[], b) => {
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
      runningTask: () => get().tasksArr.find((i) => i.isActive),
      toggleShowActiveOnly: () =>
        set((state) => ({ showActiveOnly: !state.showActiveOnly })),
      addTask: (newTaskData) =>
        set((state) => {
          const oldTasks = state.tasksArr.map((i) =>
            i.isActive ? stopRunningTask(i) : i,
          );
          const newTask = createNewTask(newTaskData);
          return { tasksArr: [newTask, ...oldTasks] };
        }),
      deleteTask: (id: string) =>
        set((state) => ({
          tasksArr: state.tasksArr.filter((i) => i.id !== id),
        })),
      renameTask: (id: string, newName: string) =>
        set((state) => ({
          tasksArr: state.tasksArr.map((i) =>
            i.id === id ? { ...i, name: newName } : i,
          ),
        })),
      toggleDoneTask: (id: string) =>
        set((state) => ({
          tasksArr: state.tasksArr.map((i) => {
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
        })),
      pauseTask: (id: string) => {
        set((state) => ({
          tasksArr: state.tasksArr.map((i) => {
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
        }));
      },
      toggleArchiveTask: (id) => {
        set((state) => ({
          tasksArr: state.tasksArr.map((i) =>
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
        }));
      },
      tasksToRender: () =>
        get().showActiveOnly
          ? get().tasksArr.filter((i) => !i.isArchived)
          : get().tasksArr,
    }),
    {
      name: persistStoreName,
      version: persistStoreVersion,
    },
  ),
);
