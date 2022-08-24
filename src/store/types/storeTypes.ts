export interface Period {
  startTime: number;
  endTime: null | number;
}

export interface Task {
  id: string;
  name: string;
  timestamp: number;
  isActive: boolean;
  isDone: boolean;
  isArchived: boolean;
  periods: Period[];
}

export interface suggestedTask {
  id?: string;
  name: string;
  timestamp?: number;
  isActive?: boolean;
  isDone: false;
  isArchived: false;
  periods: [Period];
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
