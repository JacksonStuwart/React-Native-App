"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import type { Expense, ExpenseInput } from "@/lib/firestore-schema";

export type ExpenseFilters = {
  categoryId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  search?: string;
};

export function useExpenses(filters: ExpenseFilters = {}) {
  const { user } = useAuth();
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("date", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, "id">) })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  const filtered = useMemo(() => {
    return data.filter((e) => {
      if (filters.categoryId && e.categoryId !== filters.categoryId) return false;
      const d = e.date.toDate();
      if (filters.startDate && d < filters.startDate) return false;
      if (filters.endDate && d > filters.endDate) return false;
      if (filters.search) {
        const needle = filters.search.toLowerCase();
        if (!e.description.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [data, filters.categoryId, filters.startDate, filters.endDate, filters.search]);

  async function add(input: ExpenseInput) {
    if (!user) return;
    const payload = {
      ...input,
      date: Timestamp.fromDate(input.date),
      recurringRule: input.recurringRule
        ? {
            frequency: input.recurringRule.frequency,
            endsAt: input.recurringRule.endsAt
              ? Timestamp.fromDate(input.recurringRule.endsAt)
              : null,
          }
        : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "users", user.uid, "expenses"), payload);
  }

  async function update(id: string, partial: Partial<ExpenseInput>) {
    if (!user) return;
    const payload: Record<string, unknown> = { ...partial, updatedAt: serverTimestamp() };
    if (partial.date) payload.date = Timestamp.fromDate(partial.date);
    if (partial.recurringRule) {
      payload.recurringRule = {
        frequency: partial.recurringRule.frequency,
        endsAt: partial.recurringRule.endsAt
          ? Timestamp.fromDate(partial.recurringRule.endsAt)
          : null,
      };
    }
    await updateDoc(doc(db, "users", user.uid, "expenses", id), payload);
  }

  async function remove(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "expenses", id));
  }

  return { data: filtered, allData: data, loading, add, update, remove };
}
