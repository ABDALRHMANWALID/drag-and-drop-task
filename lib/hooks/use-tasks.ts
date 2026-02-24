"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import * as api from "../api";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types";

export const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: api.fetchTasks,
    staleTime: 30_000,
  });
}

export function useCreateTaskMutation(
  options?: UseMutationOptions<Task, Error, CreateTaskPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: (_, __, ctx) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      options?.onSuccess?.(_, __, ctx);
    },
    ...options,
  });
}

export function useUpdateTaskMutation(
  options?: UseMutationOptions<Task, Error, UpdateTaskPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateTaskPayload) =>
      api.updateTask(id, payload),
    onSuccess: (_, __, ctx) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      options?.onSuccess?.(_, __, ctx);
    },
    ...options,
  });
}

export function useDeleteTaskMutation(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: (_, __, ctx) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      options?.onSuccess?.(_, __, ctx);
    },
    ...options,
  });
}
