"use client";

import { useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TaskCard } from "./TaskCard";
import type { Column, Task, TaskColumn } from "@/lib/types";
import { COLUMNS } from "@/lib/constants";

interface KanbanColumnProps {
  columnId: TaskColumn;
  label: string;
  tasks: Task[];
  onAddTask: (columnId: TaskColumn) => void;
  onLoadMore: (columnId: TaskColumn) => void;
  hasMore: boolean;
  isLoading?: boolean;
}

export function KanbanColumn({
  columnId,
  label,
  tasks,
  onAddTask,
  onLoadMore,
  hasMore,
  isLoading,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const color = COLUMNS.find((c: Column) => c.id === columnId)?.color;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minWidth: 280,
        maxWidth: 320,
        bgcolor: isOver ? "action.hover" : "grey.100",
        borderRadius: 2,
        p: 2,
        transition: "background-color 0.2s",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
          }}
        />
        <Typography variant="subtitle1" fontWeight={700}>
          {label} ({tasks.length})
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 100,
        }}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnLabel={label} />
        ))}
        {hasMore && (
          <Button
            size="small"
            onClick={() => onLoadMore(columnId)}
            disabled={isLoading}
            sx={{ mt: 1 }}
          >
            Load more
          </Button>
        )}
      </Box>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => onAddTask(columnId)}
        sx={{ mt: 2 }}
      >
        + Add task
      </Button>
    </Box>
  );
}
