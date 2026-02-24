"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { COLUMNS, TASKS_PER_PAGE } from "@/lib/constants";
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/lib/hooks/use-tasks";
import type {
  Task,
  TaskColumn,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/lib/types";

function filterTasksBySearch(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q),
  );
}

export function KanbanBoard() {
  const { data: allTasks = [], isLoading } = useTasksQuery();
  const createTask = useCreateTaskMutation();
  const updateTask = useUpdateTaskMutation();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState<TaskColumn | null>(null);
  const [pageByColumn, setPageByColumn] = useState<Record<TaskColumn, number>>(
    () => ({ todo: 1, "in-progress": 1, "in-review": 1, done: 1 }),
  );

  const filteredTasks = useMemo(
    () => filterTasksBySearch(allTasks, search),
    [allTasks, search],
  );

  const tasksByColumn = useMemo(() => {
    const map: Record<TaskColumn, Task[]> = {
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
    };
    for (const t of filteredTasks) {
      if (t.column in map) map[t.column as TaskColumn].push(t);
    }
    return map;
  }, [filteredTasks]);

  const visibleTasksByColumn = useMemo(() => {
    const out: Record<TaskColumn, Task[]> = {
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
    };
    for (const col of COLUMNS) {
      const list = tasksByColumn[col.id];
      const page = pageByColumn[col.id];
      out[col.id] = list.slice(0, page * TASKS_PER_PAGE);
    }
    return out;
  }, [tasksByColumn, pageByColumn]);

  const hasMoreByColumn = useMemo(() => {
    const out: Record<TaskColumn, boolean> = {
      todo: false,
      "in-progress": false,
      "in-review": false,
      done: false,
    };
    for (const col of COLUMNS) {
      const total = tasksByColumn[col.id].length;
      const visible = pageByColumn[col.id] * TASKS_PER_PAGE;
      out[col.id] = total > visible;
    }
    return out;
  }, [tasksByColumn, pageByColumn]);

  const handleLoadMore = useCallback((columnId: TaskColumn) => {
    setPageByColumn((prev) => ({
      ...prev,
      [columnId]: prev[columnId] + 1,
    }));
  }, []);

  const handleAddTask = useCallback((columnId: TaskColumn) => {
    setAddTaskColumn(columnId);
    setModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    (payload: CreateTaskPayload) => {
      createTask.mutate({
        title: payload.title,
        description: payload.description,
        column: payload.column,
      });
      setModalOpen(false);
      setAddTaskColumn(null);
    },
    [createTask],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const taskId = String(active.id);
      const overId = String(over.id);
      const targetColumn = COLUMNS.some((c) => c.id === overId)
        ? (overId as TaskColumn)
        : allTasks.find((t) => t.id === overId)?.column;
      const currentTask = allTasks.find((t) => t.id === taskId);
      if (targetColumn && currentTask?.column !== targetColumn) {
        updateTask.mutate({
          id: taskId,
          column: targetColumn,
        } as UpdateTaskPayload);
      }
    },
    [allTasks, updateTask],
  );

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GridViewIcon sx={{ color: "primary.main" }} />
          <Typography variant="h5" fontWeight={700}>
            KANBAN BOARD
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ alignSelf: "center" }}
          >
            {filteredTasks.length} tasks
          </Typography>
        </Box>
        <TextField
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              columnId={col.id}
              label={col.label}
              tasks={visibleTasksByColumn[col.id]}
              onAddTask={handleAddTask}
              onLoadMore={handleLoadMore}
              hasMore={hasMoreByColumn[col.id]}
              isLoading={isLoading}
            />
          ))}
        </Box>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAddTaskColumn(null);
        }}
        onSubmit={handleModalSubmit}
        defaultColumn={addTaskColumn ?? "todo"}
      />
    </div>
  );
}
