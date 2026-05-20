"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { getCategoryIcon } from "@/lib/icons";
import { formatCurrency } from "@/lib/utils";
import type { Expense } from "@/lib/firestore-schema";

export function ExpenseItem({ expense }: { expense: Expense }) {
  const { data: categories } = useCategories();
  const { remove } = useExpenses();
  const [editOpen, setEditOpen] = useState(false);

  const category = categories.find((c) => c.id === expense.categoryId);
  const Icon = getCategoryIcon(category?.icon);

  async function handleDelete() {
    if (!confirm(`Delete "${expense.description}"?`)) return;
    try {
      await remove(expense.id);
      toast.success("Expense deleted");
    } catch {
      toast.error("Couldn't delete expense");
    }
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 hover:shadow-sm transition-shadow">
        <div
          className="h-9 w-9 rounded-full grid place-items-center shrink-0"
          style={{
            backgroundColor: (category?.color ?? "#737373") + "1a",
            color: category?.color ?? "#737373",
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{expense.description}</span>
            {expense.isRecurring && (
              <Badge variant="outline" className="text-[10px] h-5">
                recurring
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{category?.name ?? "Uncategorized"}</span>
            <span>·</span>
            <span>{format(expense.date.toDate(), "MMM d, yyyy")}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold tabular-nums">
            {formatCurrency(expense.amount, expense.currency)}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-60 group-hover:opacity-100"
              aria-label="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm initial={expense} onDone={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
