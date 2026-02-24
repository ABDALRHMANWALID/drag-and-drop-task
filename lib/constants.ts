import type { TaskColumn } from "./types";

export const COLUMNS: { id: TaskColumn; label: string, color: string }[] = [
  { id: "todo", label: "TO DO", color: "#2196f3" },
  { id: "in-progress", label: "IN PROGRESS", color: "#ff9800" },
  { id: "in-review", label: "IN REVIEW", color: "#9c27b0" },
  { id: "done", label: "DONE", color: "#4caf50" },
];

export const TASKS_PER_PAGE = 10;
