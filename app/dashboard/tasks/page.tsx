"use client";

import { useMemo, useState } from "react";
import { isPast, isToday } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilters, type TaskFilterState } from "@/components/tasks/task-filters";
import { useTasks } from "@/hooks/use-tasks";

export default function TasksPage() {
  const { data: tasks, loading } = useTasks();
  const [filters, setFilters] = useState<TaskFilterState>({
    search: "",
    status: "all",
    priorities: [],
    tags: [],
  });

  const availableTags = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags))).sort(),
    [tasks]
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.search) {
        const needle = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(needle)) return false;
      }
      if (filters.priorities.length && !filters.priorities.includes(t.priority)) {
        return false;
      }
      if (filters.tags.length && !filters.tags.some((tag) => t.tags.includes(tag))) {
        return false;
      }
      switch (filters.status) {
        case "active":
          return !t.completed;
        case "completed":
          return t.completed;
        case "overdue": {
          if (t.completed) return false;
          const d = t.dueDate?.toDate();
          return d ? isPast(d) && !isToday(d) : false;
        }
        default:
          return true;
      }
    });
  }, [tasks, filters]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => {
    if (t.completed) return false;
    const d = t.dueDate?.toDate();
    return d ? isPast(d) && !isToday(d) : false;
  }).length;

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} active
          {overdueCount > 0 && (
            <span className="text-destructive"> · {overdueCount} overdue</span>
          )}
        </p>
      </div>

      <TaskForm />

      <Card>
        <CardContent className="pt-4 space-y-4">
          <TaskFilters
            filters={filters}
            onChange={setFilters}
            availableTags={availableTags}
          />
          <TaskList
            tasks={filtered}
            loading={loading}
            empty="No tasks match. Try clearing filters or adding one above."
          />
        </CardContent>
      </Card>
    </div>
  );
}
