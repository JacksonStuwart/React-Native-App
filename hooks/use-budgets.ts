"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import type { Budget, BudgetInput } from "@/lib/firestore-schema";

export function useBudgets() {
  const { user } = useAuth();
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "budgets"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Budget, "id">) })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function add(input: BudgetInput) {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "budgets"), {
      ...input,
      createdAt: serverTimestamp(),
    });
  }

  async function update(id: string, partial: Partial<BudgetInput>) {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "budgets", id), partial);
  }

  async function remove(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "budgets", id));
  }

  return { data, loading, add, update, remove };
}
