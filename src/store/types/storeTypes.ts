export interface Period {
  startTime: number;
  endTime: null | number;
}

// export interface Note {
//   id: string,
//   timestamp: number,
//   name?: string,
//   description: string,
// }

export interface Task {
  id: string;
  name: string;
  timestamp: number;
  isActive: boolean;
  isDone: boolean;
  isArchived: boolean;
  periods: Period[];
  // TODO: make futher logic
  // notes: Note[],
  // timeSpent: number, // total time spent. for not calcing each time for every period. just add to this
  // timeAdditions: number[], // addition in ms
}

export interface suggestedTask extends Partial<Task> {
  name: string;
}

export interface Store {
  tasksArr: Task[];
  showActiveOnly: boolean;
  tasksToRender: () => Task[];
  getTodayActivity: () => number;
  getWeekActivity: () => number;
  runningTask: () => Task | undefined;
  toggleShowActiveOnly: () => void;
  addTask: (newTaskData: suggestedTask) => void;
  deleteTask: (id: string) => void;
  toggleDoneTask: (id: string) => void;
  pauseTask: (id: string) => void;
  renameTask: (id: string, newName: string) => void;
  toggleArchiveTask: (id: string) => void;
}
