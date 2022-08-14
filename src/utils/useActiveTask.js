import { useStore } from "../store/store";

export function useActiveTask() {
  const activeTask = useStore((store) =>
    store.tasks.tasksArr.find((task) => task.isActive),
  );
  return activeTask;
}
