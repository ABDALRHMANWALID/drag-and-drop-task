export type TaskColumn = "todo" | "in-progress" | "in-review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  column: TaskColumn;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  column?: TaskColumn;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface Column {
  id: TaskColumn;
  label: string;
  color: string;
}
