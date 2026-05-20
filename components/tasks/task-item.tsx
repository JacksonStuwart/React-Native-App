"use client";

import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { GripVertical, Trash2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import { PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/firestore-schema";

export function TaskItem({
  task,
  draggable = true,
}: {
  task: Task;
  draggable?: boolean;
}) {
  const { toggleCompleted, remove } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !draggable || task.completed });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const due = task.dueDate?.toDate();
  const overdue = due && !task.completed && isPast(due) && !isToday(due);
  const dueSoon = due && !task.completed && isToday(due);

  async function handleDelete() {
    setDeleting(true);
    try {
      await remove(task.id);
    } catch {
      toast.error("Couldn't delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 hover:shadow-sm transition-shadow",
        task.completed && "opacity-60"
      )}
    >
      {draggable && !task.completed && (
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag handle"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleCompleted(task)}
        aria-label={task.completed ? "Mark active" : "Mark complete"}
      />

      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: PRIORITY_META[task.priority].color }}
        title={`${PRIORITY_META[task.priority].label} priority`}
      />

      <div className="min-w-0 flex-1">
        <div className={cn("text-sm font-medium truncate", task.completed && "line-through")}>
          {task.title}
        </div>
        {(due || task.tags.length > 0) && (
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
            {due && (
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  overdue && "text-destructive font-medium",
                  dueSoon && "text-primary font-medium"
                )}
              >
                {overdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <CalendarIcon className="h-3 w-3" />
                )}
                {format(due, "MMM d")}
                {overdue && " · overdue"}
                {dueSoon && " · today"}
              </span>
            )}
            {task.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px] h-5">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
