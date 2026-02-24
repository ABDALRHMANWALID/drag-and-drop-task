"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { TaskColumn, CreateTaskPayload } from "@/lib/types";
import { COLUMNS } from "@/lib/constants";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => void;
  defaultColumn?: TaskColumn;
}

export function TaskModal({
  open,
  onClose,
  onSubmit,
  defaultColumn = "todo",
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TaskColumn>(defaultColumn);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setColumn(defaultColumn);
    }
  }, [open, defaultColumn]);

  const handleSubmit = () => {
    const t = title.trim();
    const d = description.trim();
    if (!t) return;
    onSubmit({ title: t, description: d, column });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add task</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Column"
          select
          value={column}
          onChange={(e) => setColumn(e.target.value as TaskColumn)}
          SelectProps={{ native: true }}
          fullWidth
        >
          {COLUMNS.map((col) => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
