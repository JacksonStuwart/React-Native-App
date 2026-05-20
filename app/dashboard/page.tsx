"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickAddExpense } from "@/components/expenses/quick-add";
import { ExpenseList } from "@/components/expenses/expense-list";
import { useAuth } from "@/hooks/use-auth";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useCurrency } from "@/hooks/use-user-doc";
import {
  budgetProgress,
  monthOverMonth,
  totalsByCategory,
  yearTotal,
} from "@/lib/expense-utils";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth } from "date-fns";

export default function DashboardHome() {
  const { user } = useAuth();
  const { allData: expenses, loading } = useExpenses();
  const { data: categories } = useCategories();
  const { data: budgets } = useBudgets();
  const currency = useCurrency();

  const mom = monthOverMonth(expenses);
  const yt = yearTotal(expenses);
  const topCategories = totalsByCategory(
    expenses,
    categories,
    startOfMonth(new Date())
  ).slice(0, 3);
  const recent = [...expenses].slice(0, 5);
  const topBudgets = budgets.slice(0, 3);
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hi, {firstName}.</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s a quick look at your money.
          </p>
        </div>
        <QuickAddExpense />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Wallet className="h-4 w-4" /> This month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div>
                <div className="text-2xl font-bold tabular-nums">
                  {formatCurrency(mom.current, currency)}
                </div>
                {mom.delta !== null && (
                  <div
                    className={`text-xs flex items-center gap-0.5 mt-1 ${
                      mom.delta > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {mom.delta > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(mom.delta).toFixed(1)}% vs last month
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4" /> Last month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrency(mom.previous, currency)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> Year to date
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrency(yt, currency)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/expenses">
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ExpenseList
              expenses={recent}
              loading={loading}
              empty="Nothing logged yet. Add your first expense above."
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top categories this month</CardTitle>
            </CardHeader>
            <CardContent>
              {topCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No spending this month.</p>
              ) : (
                <div className="space-y-3">
                  {topCategories.map(({ category, total }) => (
                    <div key={category.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm truncate">{category.name}</span>
                      </div>
                      <span className="text-sm tabular-nums font-medium">
                        {formatCurrency(total, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Target className="h-4 w-4" /> Budgets
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/expenses">View</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {topBudgets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No budgets yet.{" "}
                  <Link
                    href="/dashboard/expenses"
                    className="text-primary hover:underline"
                  >
                    Set one
                  </Link>
                  .
                </p>
              ) : (
                <div className="space-y-4">
                  {topBudgets.map((b) => {
                    const { spent, pct } = budgetProgress(b, expenses);
                    const over = spent > b.amount;
                    return (
                      <div key={b.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate font-medium">{b.name}</span>
                          {over && <Badge variant="destructive" className="text-[10px]">over</Badge>}
                        </div>
                        <Progress
                          value={pct}
                          indicatorClassName={over ? "bg-destructive" : undefined}
                        />
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(spent, currency)} of {formatCurrency(b.amount, currency)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
