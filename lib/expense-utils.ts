import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  format,
  isAfter,
  isBefore,
} from "date-fns";
import type { Expense, Category, Budget } from "@/lib/firestore-schema";

export function totalIn(
  expenses: Expense[],
  start: Date,
  end: Date
): number {
  return expenses.reduce((sum, e) => {
    const d = e.date.toDate();
    if (!isBefore(d, start) && !isAfter(d, end)) return sum + e.amount;
    return sum;
  }, 0);
}

export function monthTotal(expenses: Expense[], anchor = new Date()): number {
  return totalIn(expenses, startOfMonth(anchor), endOfMonth(anchor));
}

export function yearTotal(expenses: Expense[], anchor = new Date()): number {
  return totalIn(expenses, startOfYear(anchor), endOfYear(anchor));
}

export function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

export function monthOverMonth(expenses: Expense[]) {
  const now = new Date();
  const current = monthTotal(expenses, now);
  const previous = monthTotal(expenses, subMonths(now, 1));
  return { current, previous, delta: deltaPercent(current, previous) };
}

export function totalsByCategory(
  expenses: Expense[],
  categories: Category[],
  start?: Date,
  end?: Date
): { category: Category; total: number }[] {
  const filtered = expenses.filter((e) => {
    if (!start && !end) return true;
    const d = e.date.toDate();
    if (start && isBefore(d, start)) return false;
    if (end && isAfter(d, end)) return false;
    return true;
  });
  const totals = new Map<string, number>();
  for (const e of filtered) {
    totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);
  }
  return categories
    .map((c) => ({ category: c, total: totals.get(c.id) ?? 0 }))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function dailySeries(
  expenses: Expense[],
  days: number
): { date: string; total: number }[] {
  const map = new Map<string, number>();
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    map.set(format(d, "yyyy-MM-dd"), 0);
  }

  for (const e of expenses) {
    const d = e.date.toDate();
    if (d < start) continue;
    const key = format(d, "yyyy-MM-dd");
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + e.amount);
  }

  return Array.from(map.entries()).map(([date, total]) => ({
    date,
    label: format(new Date(date), "MMM d"),
    total,
  })) as { date: string; total: number; label: string }[];
}

export function monthlySeries(
  expenses: Expense[],
  months: number
): { month: string; label: string; total: number }[] {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(now, i);
    map.set(format(d, "yyyy-MM"), 0);
  }
  for (const e of expenses) {
    const key = format(e.date.toDate(), "yyyy-MM");
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  return Array.from(map.entries()).map(([month, total]) => ({
    month,
    label: format(new Date(month + "-01"), "MMM"),
    total,
  }));
}

export function budgetProgress(
  budget: Budget,
  expenses: Expense[]
): { spent: number; pct: number } {
  const now = new Date();
  let start: Date;
  let end: Date;

  if (budget.scope === "monthly" || budget.scope === "category") {
    start = startOfMonth(now);
    end = endOfMonth(now);
  } else if (budget.scope === "yearly") {
    start = startOfYear(now);
    end = endOfYear(now);
  } else {
    return { spent: 0, pct: 0 };
  }

  const spent = expenses.reduce((sum, e) => {
    const d = e.date.toDate();
    if (isBefore(d, start) || isAfter(d, end)) return sum;
    if (budget.scope === "category" && e.categoryId !== budget.categoryId) return sum;
    return sum + e.amount;
  }, 0);

  const pct = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
  return { spent, pct };
}
