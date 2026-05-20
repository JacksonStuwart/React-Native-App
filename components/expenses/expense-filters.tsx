"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import type { ExpenseFilters as Filters } from "@/hooks/use-expenses";

export function ExpenseFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const { data: categories } = useCategories();
  const hasFilter =
    filters.search || filters.categoryId || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search description…"
        value={filters.search ?? ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="max-w-xs"
      />
      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(v) =>
          onChange({ ...filters, categoryId: v === "all" ? null : v })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(!filters.startDate && "text-muted-foreground")}>
            <CalendarIcon className="h-4 w-4" />
            {filters.startDate ? format(filters.startDate, "MMM d") : "From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.startDate ?? undefined}
            onSelect={(d) => onChange({ ...filters, startDate: d ?? null })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(!filters.endDate && "text-muted-foreground")}>
            <CalendarIcon className="h-4 w-4" />
            {filters.endDate ? format(filters.endDate, "MMM d") : "To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.endDate ?? undefined}
            onSelect={(d) => onChange({ ...filters, endDate: d ?? null })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({ search: "", categoryId: null, startDate: null, endDate: null })
          }
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
