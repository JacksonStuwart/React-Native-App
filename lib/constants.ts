export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "Utensils", color: "#f97316", budgetMonthly: null, order: 0 },
  { name: "Transport", icon: "Car", color: "#3b82f6", budgetMonthly: null, order: 1 },
  { name: "Bills", icon: "Receipt", color: "#ef4444", budgetMonthly: null, order: 2 },
  { name: "Shopping", icon: "ShoppingBag", color: "#ec4899", budgetMonthly: null, order: 3 },
  { name: "Entertainment", icon: "Popcorn", color: "#a855f7", budgetMonthly: null, order: 4 },
  { name: "Health", icon: "HeartPulse", color: "#10b981", budgetMonthly: null, order: 5 },
  { name: "Education", icon: "GraduationCap", color: "#6366f1", budgetMonthly: null, order: 6 },
  { name: "Travel", icon: "Plane", color: "#14b8a6", budgetMonthly: null, order: 7 },
  { name: "Other", icon: "MoreHorizontal", color: "#737373", budgetMonthly: null, order: 8 },
] as const;

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; color: string; weight: number }
> = {
  low: { label: "Low", color: "#737373", weight: 0 },
  medium: { label: "Medium", color: "#3b82f6", weight: 1 },
  high: { label: "High", color: "#ef4444", weight: 2 },
};
