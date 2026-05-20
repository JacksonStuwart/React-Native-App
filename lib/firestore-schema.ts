import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

// ---------- User ----------
export const userSettingsSchema = z.object({
  currency: z.string().default("INR"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  defaultCategoryId: z.string().nullable().default(null),
});
export type UserSettings = z.infer<typeof userSettingsSchema>;

export interface UserDoc {
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
  settings: UserSettings;
}

// ---------- Category ----------
export const categorySchema = z.object({
  name: z.string().min(1, "Name required").max(40),
  icon: z.string().default("Tag"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex"),
  budgetMonthly: z.number().nullable(),
  order: z.number().int(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export interface Category extends CategoryInput {
  id: string;
  createdAt: Timestamp;
}

// ---------- Expense ----------
export const recurringFrequencySchema = z.enum(["daily", "weekly", "monthly"]);
export type RecurringFrequency = z.infer<typeof recurringFrequencySchema>;

export const expenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive")
    .max(1_000_000_000, "Too large"),
  currency: z.string(),
  categoryId: z.string().min(1, "Pick a category"),
  description: z.string().min(1, "Describe the spend").max(80),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  recurringRule: z
    .object({
      frequency: recurringFrequencySchema,
      endsAt: z.date().nullable(),
    })
    .nullable()
    .default(null),
  notes: z.string().max(500).nullable().default(null),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export interface Expense extends Omit<ExpenseInput, "date" | "recurringRule"> {
  id: string;
  date: Timestamp;
  recurringRule: {
    frequency: RecurringFrequency;
    endsAt: Timestamp | null;
  } | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------- Budget ----------
export const budgetSchema = z.object({
  name: z.string().min(1).max(40),
  amount: z.number().positive(),
  scope: z.enum(["monthly", "yearly", "category"]),
  categoryId: z.string().nullable().default(null),
  period: z.string().nullable().default(null), // e.g. '2026-05' or '2026'
});
export type BudgetInput = z.infer<typeof budgetSchema>;

export interface Budget extends BudgetInput {
  id: string;
  createdAt: Timestamp;
}

// ---------- Task ----------
export const taskSchema = z.object({
  title: z.string().min(1, "Title required").max(120),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().nullable().default(null),
  tags: z.array(z.string().max(20)).default([]),
  order: z.number().int().default(0),
});
export type TaskInput = z.infer<typeof taskSchema>;

export interface Task extends Omit<TaskInput, "dueDate"> {
  id: string;
  dueDate: Timestamp | null;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
}

// ---------- Vault ----------
export const vaultEntrySchema = z.object({
  name: z.string().min(1, "Source required").max(60),
  username: z.string().min(1, "Username required").max(200),
  password: z.string().min(1, "Password required").max(500),
  url: z.string().url().nullable().or(z.literal("")).default(""),
  notes: z.string().max(500).nullable().default(null),
  tags: z.array(z.string().max(20)).default([]),
});
export type VaultEntryInput = z.infer<typeof vaultEntrySchema>;

export interface VaultEntry {
  id: string;
  name: string;
  username: string; // AES ciphertext
  password: string; // AES ciphertext
  url: string | null;
  notes: string | null; // AES ciphertext
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------- Watchlist / Portfolio ----------
export interface WatchlistEntry {
  coinId: string;
  symbol: string;
  addedAt: Timestamp;
}

export interface PortfolioEntry {
  coinId: string;
  amount: number;
  addedAt: Timestamp;
}
