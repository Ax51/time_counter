import create from "zustand";
import { nanoid } from "nanoid";

const taskInitialState = {
  id: String(),
  name: String(),
  timestamp: +new Date(),
  isActive: Boolean(),
};

export const useStore = create((set, get) => ({
  tasks: {
    tasksArr: [],
    addTask: (givenData) =>
      set((state) => {
        const oldTasks = state.tasks.tasksArr.map((i) => ({
          ...i,
          isActive: false,
        }));
        const newTask = {
          id: givenData.id ?? nanoid(10),
          name: givenData.name ?? taskInitialState.name,
          timestamp: givenData.timestamp ?? taskInitialState.timestamp,
          isActive: givenData.isActive ?? taskInitialState.isActive,
        };
        return {
          tasks: { ...state.tasks, tasksArr: [...oldTasks, newTask] },
        };
      }),
    findTask: (id) => get().tasks.tasksArr.filter((i) => i.id === id)[0],
    pauseTask: (id) =>
      set((state) => {
        const taskIndex = state.tasks.tasksArr.findIndex((i) => i.id === id);
        const isNowActive = state.tasks.tasksArr[taskIndex].isActive;
        return {
          tasks: {
            ...state.tasks,
            tasksArr: get().tasks.tasksArr.map((i) =>
              i.id === id
                ? { ...i, isActive: !isNowActive }
                : { ...i, isActive: false },
            ),
          },
        };
      }),
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
}));
