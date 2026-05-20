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
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import type { Task, TaskInput } from "@/lib/firestore-schema";

export function useTasks() {
  const { user } = useAuth();
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("completed", "asc"),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function add(input: Partial<TaskInput> & { title: string }) {
    if (!user) return;
    const order = data.filter((t) => !t.completed).length;
    const payload = {
      title: input.title,
      completed: false,
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
      tags: input.tags ?? [],
      order,
      completedAt: null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "users", user.uid, "tasks"), payload);
  }

  async function update(id: string, partial: Partial<TaskInput>) {
    if (!user) return;
    const payload: Record<string, unknown> = { ...partial };
    if (partial.dueDate !== undefined) {
      payload.dueDate = partial.dueDate ? Timestamp.fromDate(partial.dueDate) : null;
    }
    await updateDoc(doc(db, "users", user.uid, "tasks", id), payload);
  }

  async function toggleCompleted(task: Task) {
    if (!user) return;
    const next = !task.completed;
    await updateDoc(doc(db, "users", user.uid, "tasks", task.id), {
      completed: next,
      completedAt: next ? serverTimestamp() : null,
    });
  }

  async function remove(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  }

  async function reorder(activeIds: string[]) {
    if (!user) return;
    const batch = writeBatch(db);
    activeIds.forEach((id, i) => {
      batch.update(doc(db, "users", user.uid!, "tasks", id), { order: i });
    });
    await batch.commit();
  }

  return { data, loading, add, update, toggleCompleted, remove, reorder };
}
