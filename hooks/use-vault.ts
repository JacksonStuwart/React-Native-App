"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { checkVerifier, decrypt, encrypt, makeVerifier } from "@/lib/crypto";
import {
  decryptLegacyKeys,
  fetchLegacyKeys,
  legacyKeyMatches,
  type LegacyKeys,
} from "@/lib/legacy";
import type { VaultEntry, VaultEntryInput } from "@/lib/firestore-schema";

export type DecryptedVaultEntry = {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  tags: string[];
  createdAt: VaultEntry["createdAt"] | null;
  updatedAt: VaultEntry["updatedAt"] | null;
  /** Saved by the original React Native app (Realtime Database); read-only here. */
  legacy?: boolean;
};

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export function useVault(masterKey: string | null) {
  const { user } = useAuth();
  const [raw, setRaw] = useState<VaultEntry[]>([]);
  const [legacyRaw, setLegacyRaw] = useState<LegacyKeys>({});
  const [loading, setLoading] = useState(true);
  const [legacyLoading, setLegacyLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRaw([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "users", user.uid, "vault"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRaw(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VaultEntry, "id">) })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user || !masterKey) {
      setLegacyRaw({});
      setLegacyLoading(false);
      return;
    }
    let cancelled = false;
    setLegacyLoading(true);
    fetchLegacyKeys(user.uid).then((keys) => {
      if (cancelled) return;
      setLegacyRaw(keys);
      setLegacyLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, masterKey]);

  const current: DecryptedVaultEntry[] = masterKey
    ? raw.map((e) => ({
        id: e.id,
        name: e.name,
        username: decrypt(e.username, masterKey),
        password: decrypt(e.password, masterKey),
        url: e.url,
        notes: e.notes ? decrypt(e.notes, masterKey) : null,
        tags: e.tags ?? [],
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }))
    : [];

  const legacy: DecryptedVaultEntry[] = masterKey
    ? decryptLegacyKeys(legacyRaw, masterKey).map((e) => ({
        id: `legacy:${e.name}`,
        name: e.name,
        username: e.username,
        password: e.password,
        url: null,
        notes: null,
        tags: [],
        createdAt: null,
        updatedAt: null,
        legacy: true,
      }))
    : [];

  async function add(input: VaultEntryInput) {
    if (!user || !masterKey) return;
    await addDoc(collection(db, "users", user.uid, "vault"), {
      name: input.name,
      username: encrypt(input.username, masterKey),
      password: encrypt(input.password, masterKey),
      url: input.url || null,
      notes: input.notes ? encrypt(input.notes, masterKey) : null,
      tags: input.tags ?? [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function update(id: string, input: VaultEntryInput) {
    if (!user || !masterKey) return;
    await updateDoc(doc(db, "users", user.uid, "vault", id), {
      name: input.name,
      username: encrypt(input.username, masterKey),
      password: encrypt(input.password, masterKey),
      url: input.url || null,
      notes: input.notes ? encrypt(input.notes, masterKey) : null,
      tags: input.tags ?? [],
      updatedAt: serverTimestamp(),
    });
  }

  async function remove(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "vault", id));
  }

  return {
    data: [...current, ...legacy],
    raw,
    loading: loading || legacyLoading,
    add,
    update,
    remove,
  };
}

/** Whether this user already has a master key (old-app passwords or a new-vault verifier). */
export async function vaultHasExistingKey(uid: string): Promise<boolean> {
  const legacy = await fetchLegacyKeys(uid);
  if (Object.keys(legacy).length > 0) return true;
  try {
    const snap = await withTimeout(getDoc(doc(db, "users", uid, "vaultMeta", "verifier")), 6000);
    return snap.exists();
  } catch {
    return false;
  }
}

export async function verifyMasterKey(
  uid: string,
  candidateKey: string
): Promise<"new" | "ok" | "wrong"> {
  // Old app's saved passwords are the source of truth for the key, if any exist.
  const legacy = await fetchLegacyKeys(uid);
  if (Object.keys(legacy).length > 0) {
    return legacyKeyMatches(legacy, candidateKey) ? "ok" : "wrong";
  }

  // Otherwise use (or create) the Firestore verifier. Tolerate Firestore being
  // unavailable on older projects: the key just won't be checked.
  try {
    const verifierRef = doc(db, "users", uid, "vaultMeta", "verifier");
    const snap = await withTimeout(getDoc(verifierRef), 6000);
    if (!snap.exists()) {
      await withTimeout(
        setDoc(verifierRef, { ciphertext: makeVerifier(candidateKey), createdAt: serverTimestamp() }),
        6000
      );
      return "new";
    }
    const ct = (snap.data() as { ciphertext: string }).ciphertext;
    return checkVerifier(ct, candidateKey) ? "ok" : "wrong";
  } catch (err) {
    console.warn("[vault] Firestore verifier unavailable", err);
    return "new";
  }
}
