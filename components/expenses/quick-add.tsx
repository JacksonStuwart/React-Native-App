"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";

export function QuickAddExpense({
  variant = "default",
  label = "Add expense",
}: {
  variant?: "default" | "outline" | "ghost";
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="gap-1.5">
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
          <DialogDescription>Log something you spent on.</DialogDescription>
        </DialogHeader>
        <ExpenseForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
