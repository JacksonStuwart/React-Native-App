"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseItem } from "@/components/expenses/expense-item";
import type { Expense } from "@/lib/firestore-schema";

export function ExpenseList({
  expenses,
  loading,
  empty = "No expenses yet.",
}: {
  expenses: Expense[];
  loading?: boolean;
  empty?: string;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} />
      ))}
    </div>
  );
}
