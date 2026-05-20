"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { CATEGORY_ICON_NAMES, getCategoryIcon } from "@/lib/icons";
import type { Category } from "@/lib/firestore-schema";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#737373",
];

export function CategoryManager() {
  const { data, add, update, remove } = useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [monthly, setMonthly] = useState("");

  function reset() {
    setEditing(null);
    setName("");
    setIcon("Tag");
    setColor(PRESET_COLORS[0]);
    setMonthly("");
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setMonthly(cat.budgetMonthly?.toString() ?? "");
    setOpen(true);
  }

  async function save() {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    const payload = {
      name: name.trim(),
      icon,
      color,
      budgetMonthly: monthly ? Number(monthly) : null,
      order: editing?.order ?? data.length,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success("Category updated");
      } else {
        await add(payload);
        toast.success("Category added");
      }
      setOpen(false);
      reset();
    } catch {
      toast.error("Couldn't save category");
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? Existing expenses keep their category id.`)) return;
    try {
      await remove(cat.id);
      toast.success("Category deleted");
    } catch {
      toast.error("Couldn't delete");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : (setOpen(false), reset()))}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            New category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Used to organize and budget your expenses.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Groceries"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CATEGORY_ICON_NAMES.map((n) => {
                    const Icon = getCategoryIcon(n);
                    return (
                      <SelectItem key={n} value={n}>
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          {n}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="h-7 w-7 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? "hsl(var(--foreground))" : "transparent",
                    }}
                    aria-label={`Pick ${c}`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-budget">Monthly budget (optional)</Label>
              <Input
                id="cat-budget"
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
            >
              <div
                className="h-9 w-9 rounded-full grid place-items-center"
                style={{ backgroundColor: cat.color + "1a", color: cat.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{cat.name}</div>
                {cat.budgetMonthly && (
                  <div className="text-xs text-muted-foreground">
                    Budget: {cat.budgetMonthly}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDelete(cat)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
