import type { Task, CreateTaskPayload } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json() as Promise<T>;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  const data = await handleResponse<{ tasks?: Task[] } | Task[]>(res);
  if (Array.isArray(data)) return data as Task[];
  if (data && "tasks" in data && data.tasks) return data.tasks;
  return [];
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(
  id: string,
  payload: Partial<Pick<Task, "column">>
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) await handleResponse<unknown>(res);
}
