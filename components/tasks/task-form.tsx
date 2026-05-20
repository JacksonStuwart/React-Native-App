"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/hooks/use-tasks";
import { PRIORITY_META, type TaskPriority } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TaskForm() {
  const { add } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    setSubmitting(true);
    try {
      await add({ title: title.trim(), priority, dueDate, tags });
      setTitle("");
      setPriority("medium");
      setDueDate(null);
      setTags([]);
      setTagInput("");
      toast.success("Task added");
    } catch {
      toast.error("Couldn't add task");
    } finally {
      setSubmitting(false);
    }
  }

  function addTag() {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v) && tags.length < 5) {
      setTags([...tags, v]);
    }
    setTagInput("");
  }

  function onTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <Input
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        autoFocus
      />
      <div className="flex flex-wrap items-center gap-2">
        <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(!dueDate && "text-muted-foreground")}
              size="sm"
            >
              <CalendarIcon className="h-4 w-4" />
              {dueDate ? format(dueDate, "MMM d") : "Due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate ?? undefined}
              onSelect={(d) => setDueDate(d ?? null)}
            />
          </PopoverContent>
        </Popover>

        {dueDate && (
          <Button variant="ghost" size="sm" onClick={() => setDueDate(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        )}

        <div className="flex items-center gap-1 flex-wrap">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                aria-label={`Remove ${t}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {tags.length < 5 && (
            <Input
              placeholder="Add tag…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              onBlur={addTag}
              className="h-7 w-24 text-xs"
            />
          )}
        </div>

        <Button
          onClick={submit}
          size="sm"
          disabled={submitting || !title.trim()}
          className="ml-auto"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </Button>
      </div>

      <PriorityHint priority={priority} />
    </div>
  );
}

function PriorityHint({ priority }: { priority: TaskPriority }) {
  return (
    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: PRIORITY_META[priority].color }}
      />
      {PRIORITY_META[priority].label} priority
    </div>
  );
}
