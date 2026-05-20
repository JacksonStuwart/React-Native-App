"use client";

import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TASK_PRIORITIES, type TaskPriority } from "@/lib/constants";

export type TaskFilterState = {
  search: string;
  status: "all" | "active" | "completed" | "overdue";
  priorities: TaskPriority[];
  tags: string[];
};

export function TaskFilters({
  filters,
  onChange,
  availableTags,
}: {
  filters: TaskFilterState;
  onChange: (next: TaskFilterState) => void;
  availableTags: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search tasks…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="max-w-xs"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Status
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              {filters.status}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {(["all", "active", "completed", "overdue"] as const).map((s) => (
            <DropdownMenuCheckboxItem
              key={s}
              checked={filters.status === s}
              onCheckedChange={() => onChange({ ...filters, status: s })}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Priority
            {filters.priorities.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {filters.priorities.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TASK_PRIORITIES.map((p) => (
            <DropdownMenuCheckboxItem
              key={p}
              checked={filters.priorities.includes(p)}
              onCheckedChange={(c) => {
                const next = c
                  ? [...filters.priorities, p]
                  : filters.priorities.filter((x) => x !== p);
                onChange({ ...filters, priorities: next });
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {availableTags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={filters.tags.includes(tag)}
                onCheckedChange={(c) => {
                  const next = c
                    ? [...filters.tags, tag]
                    : filters.tags.filter((x) => x !== tag);
                  onChange({ ...filters, tags: next });
                }}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
