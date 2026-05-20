"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "atlas-vault-master-key";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useMasterKey() {
  const [key, setKeyState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setKeyState(sessionStorage.getItem(STORAGE_KEY));
    const handler = () => setKeyState(sessionStorage.getItem(STORAGE_KEY));
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const setKey = useCallback((next: string | null) => {
    if (typeof window === "undefined") return;
    if (next) {
      sessionStorage.setItem(STORAGE_KEY, next);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    notify();
  }, []);

  return { key, setKey, hasKey: !!key };
}
