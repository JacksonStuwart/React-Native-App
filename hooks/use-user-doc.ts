"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import type { UserDoc, UserSettings } from "@/lib/firestore-schema";

export function useUserDoc() {
  const { user } = useAuth();
  const [data, setData] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? (snap.data() as UserDoc) : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function updateSettings(partial: Partial<UserSettings>) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const next = Object.fromEntries(
      Object.entries(partial).map(([k, v]) => [`settings.${k}`, v])
    );
    await updateDoc(ref, next);
  }

  return { data, loading, updateSettings };
}

export function useCurrency(): string {
  const { data } = useUserDoc();
  return data?.settings?.currency ?? "INR";
}
