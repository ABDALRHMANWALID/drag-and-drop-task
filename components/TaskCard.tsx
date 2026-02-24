"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, Chip, Typography } from "@mui/material";
import type { Column, Task } from "@/lib/types";
import { COLUMNS } from "@/lib/constants";

interface TaskCardProps {
  task: Task;
  columnLabel: string;
}

export function TaskCard({ task, columnLabel }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.9 : 1,
        boxShadow: isDragging ? 4 : 1,
        mb: 1.5,
        "&:hover": { boxShadow: 2 },
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        <Chip
          label={columnLabel}
          size="small"
          sx={{
            mt: 1,
            fontSize: "0.7rem",
            height: 20,
            backgroundColor: COLUMNS.find((c: Column) => c.id === task.column)
              ?.color,
          }}
        />
      </CardContent>
    </Card>
  );
}
