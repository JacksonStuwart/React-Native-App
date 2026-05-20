"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import {
  dailySeries,
  monthlySeries,
  totalsByCategory,
} from "@/lib/expense-utils";
import type { Category, Expense } from "@/lib/firestore-schema";

export function ExpenseCharts({
  expenses,
  categories,
  currency,
}: {
  expenses: Expense[];
  categories: Category[];
  currency: string;
}) {
  const daily = dailySeries(expenses, 30) as { date: string; total: number; label: string }[];
  const monthly = monthlySeries(expenses, 12);
  const byCategory = totalsByCategory(expenses, categories);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Spending trend · last 30 days</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily} margin={{ left: 6, right: 6, top: 4, bottom: 4 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: 12 }}
                tickFormatter={(v) => formatCompactNumber(v as number)}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
                      <div className="font-medium">{label}</div>
                      <div className="text-muted-foreground">
                        {formatCurrency(payload[0].value as number, currency)}
                      </div>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#trendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By category</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {byCategory.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
              Add a few expenses to see the breakdown.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey={(d) => d.category.name}
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {byCategory.map((row) => (
                    <Cell key={row.category.id} fill={row.category.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
                        <div className="font-medium">
                          {(payload[0].payload as { category: Category }).category.name}
                        </div>
                        <div className="text-muted-foreground">
                          {formatCurrency(payload[0].value as number, currency)}
                        </div>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly · last 12 months</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: 6, right: 6, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: 12 }}
                tickFormatter={(v) => formatCompactNumber(v as number)}
                width={50}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
                      <div className="font-medium">{label}</div>
                      <div className="text-muted-foreground">
                        {formatCurrency(payload[0].value as number, currency)}
                      </div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
