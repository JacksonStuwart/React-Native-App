"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { Skeleton } from "@/components/ui/skeleton";
import { TaskItem } from "@/components/tasks/task-item";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/lib/firestore-schema";

export function TaskList({
  tasks,
  loading,
  empty = "No tasks here.",
}: {
  tasks: Task[];
  loading?: boolean;
  empty?: string;
}) {
  const { reorder } = useTasks();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const active = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completed = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  async function onDragEnd(event: DragEndEvent) {
    const { active: a, over } = event;
    if (!over || a.id === over.id) return;
    const oldIndex = active.findIndex((t) => t.id === a.id);
    const newIndex = active.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(active, oldIndex, newIndex);
    await reorder(next.map((t) => t.id));
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={active.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {active.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {completed.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            Completed · {completed.length}
          </div>
          <div className="space-y-2">
            {completed.map((t) => (
              <TaskItem key={t.id} task={t} draggable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
