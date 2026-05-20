"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseList } from "@/components/expenses/expense-list";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { ExpenseCharts } from "@/components/expenses/expense-charts";
import { Budgets } from "@/components/expenses/budgets";
import { CategoryManager } from "@/components/expenses/category-manager";
import { QuickAddExpense } from "@/components/expenses/quick-add";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses, type ExpenseFilters as Filters } from "@/hooks/use-expenses";
import { useCurrency } from "@/hooks/use-user-doc";
import { downloadCSV } from "@/lib/csv";
import { formatCurrency } from "@/lib/utils";

export default function ExpensesPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data: expenses, allData, loading } = useExpenses(filters);
  const { data: categories } = useCategories();
  const currency = useCurrency();

  const filteredTotal = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  function handleExport() {
    if (!expenses.length) {
      toast.error("Nothing to export");
      return;
    }
    const rows: (string | number)[][] = [
      ["Date", "Description", "Category", "Amount", "Currency", "Recurring", "Notes"],
    ];
    for (const e of expenses) {
      const cat = categories.find((c) => c.id === e.categoryId)?.name ?? "";
      rows.push([
        format(e.date.toDate(), "yyyy-MM-dd"),
        e.description,
        cat,
        e.amount,
        e.currency,
        e.isRecurring ? "yes" : "no",
        e.notes ?? "",
      ]);
    }
    downloadCSV(`atlas-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`, rows);
    toast.success("Exported CSV");
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            All your spending, organized.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <QuickAddExpense />
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <ExpenseFilters filters={filters} onChange={setFilters} />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {expenses.length} expense{expenses.length === 1 ? "" : "s"}
                </span>
                <span className="font-medium tabular-nums">
                  Total: {formatCurrency(filteredTotal, currency)}
                </span>
              </div>
              <ExpenseList expenses={expenses} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <ExpenseCharts
            expenses={allData}
            categories={categories}
            currency={currency}
          />
        </TabsContent>

        <TabsContent value="budgets">
          <Budgets />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
