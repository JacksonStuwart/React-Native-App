"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useCurrency } from "@/hooks/use-user-doc";
import { budgetProgress } from "@/lib/expense-utils";
import { formatCurrency } from "@/lib/utils";

export function Budgets() {
  const { data: budgets, add, remove } = useBudgets();
  const { data: categories } = useCategories();
  const { allData: expenses } = useExpenses();
  const currency = useCurrency();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [scope, setScope] = useState<"monthly" | "yearly" | "category">("monthly");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  async function save() {
    const num = Number(amount);
    if (!name.trim() || !num) {
      toast.error("Name and amount required");
      return;
    }
    try {
      await add({
        name: name.trim(),
        amount: num,
        scope,
        categoryId: scope === "category" ? categoryId : null,
        period: null,
      });
      toast.success("Budget added");
      setOpen(false);
      setName("");
      setAmount("");
      setScope("monthly");
      setCategoryId(null);
    } catch {
      toast.error("Couldn't add budget");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Budgets</h3>
          <p className="text-sm text-muted-foreground">
            Set monthly or yearly limits — overall or per category.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New budget</DialogTitle>
              <DialogDescription>Track progress against a spending cap.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="b-name">Name</Label>
                <Input
                  id="b-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monthly groceries"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-amt">Amount</Label>
                <Input
                  id="b-amt"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select
                  value={scope}
                  onValueChange={(v) => setScope(v as "monthly" | "yearly" | "category")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Overall monthly</SelectItem>
                    <SelectItem value="yearly">Overall yearly</SelectItem>
                    <SelectItem value="category">Per category (monthly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {scope === "category" && (
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={categoryId ?? ""}
                    onValueChange={(v) => setCategoryId(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={save}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          No budgets yet. Add one to track your spending limits.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {budgets.map((b) => {
            const { spent, pct } = budgetProgress(b, expenses);
            const over = spent > b.amount;
            const remaining = Math.max(b.amount - spent, 0);
            const cat = b.categoryId
              ? categories.find((c) => c.id === b.categoryId)
              : null;
            return (
              <div key={b.id} className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.scope === "category" && cat ? cat.name : b.scope}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={async () => {
                      if (confirm(`Delete budget "${b.name}"?`)) {
                        await remove(b.id);
                        toast.success("Budget deleted");
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Progress
                  value={pct}
                  indicatorClassName={over ? "bg-destructive" : undefined}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={over ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {formatCurrency(spent, currency)} of {formatCurrency(b.amount, currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {over
                      ? `Over by ${formatCurrency(spent - b.amount, currency)}`
                      : `${formatCurrency(remaining, currency)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
