"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useCurrency } from "@/hooks/use-user-doc";
import type { Expense } from "@/lib/firestore-schema";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  categoryId: z.string().min(1, "Pick a category"),
  description: z.string().min(1, "Describe the spend").max(80),
  date: z.date(),
  notes: z.string().max(500).optional(),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ExpenseForm({
  initial,
  onDone,
}: {
  initial?: Expense;
  onDone?: () => void;
}) {
  const { data: categories } = useCategories();
  const { add, update } = useExpenses();
  const currency = useCurrency();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initial?.amount ?? ("" as unknown as number),
      categoryId: initial?.categoryId ?? "",
      description: initial?.description ?? "",
      date: initial ? initial.date.toDate() : new Date(),
      notes: initial?.notes ?? "",
      isRecurring: initial?.isRecurring ?? false,
      recurringFrequency: initial?.recurringRule?.frequency ?? "monthly",
    },
  });

  const isRecurring = watch("isRecurring");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = {
        amount: values.amount,
        currency,
        categoryId: values.categoryId,
        description: values.description,
        date: values.date,
        notes: values.notes || null,
        isRecurring: values.isRecurring,
        recurringRule:
          values.isRecurring && values.recurringFrequency
            ? { frequency: values.recurringFrequency, endsAt: null }
            : null,
      };
      if (initial) {
        await update(initial.id, payload);
        toast.success("Expense updated");
      } else {
        await add(payload);
        toast.success("Expense added");
      }
      onDone?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save expense");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            inputMode="decimal"
            autoFocus={!initial}
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {field.value ? format(field.value, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(d) => d && field.onChange(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g. Lunch at the cafe"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => {
                  const Icon = getCategoryIcon(c.icon);
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Anything to remember about this spend?"
          rows={2}
          {...register("notes")}
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Controller
          control={control}
          name="isRecurring"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Recurring expense</Label>
                <p className="text-xs text-muted-foreground">
                  Marks this as a regular spend (for tracking).
                </p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
        {isRecurring && (
          <Controller
            control={control}
            name="recurringFrequency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Save changes" : "Add expense"}
        </Button>
      </div>
    </form>
  );
}
