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
import type { VaultEntry, VaultEntryInput } from "@/lib/firestore-schema";

export type DecryptedVaultEntry = {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  tags: string[];
  createdAt: VaultEntry["createdAt"];
  updatedAt: VaultEntry["updatedAt"];
};

export function useVault(masterKey: string | null) {
  const { user } = useAuth();
  const [raw, setRaw] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);

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

  const data: DecryptedVaultEntry[] = masterKey
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

  async function add(input: VaultEntryInput) {
    if (!user || !masterKey) return;
    const payload = {
      name: input.name,
      username: encrypt(input.username, masterKey),
      password: encrypt(input.password, masterKey),
      url: input.url || null,
      notes: input.notes ? encrypt(input.notes, masterKey) : null,
      tags: input.tags ?? [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "users", user.uid, "vault"), payload);
  }

  async function update(id: string, input: VaultEntryInput) {
    if (!user || !masterKey) return;
    const payload = {
      name: input.name,
      username: encrypt(input.username, masterKey),
      password: encrypt(input.password, masterKey),
      url: input.url || null,
      notes: input.notes ? encrypt(input.notes, masterKey) : null,
      tags: input.tags ?? [],
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(db, "users", user.uid, "vault", id), payload);
  }

  async function remove(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "vault", id));
  }

  return { data, raw, loading, add, update, remove };
}

export async function verifyMasterKey(
  uid: string,
  candidateKey: string
): Promise<"new" | "ok" | "wrong"> {
  const verifierRef = doc(db, "users", uid, "vaultMeta", "verifier");
  const snap = await getDoc(verifierRef);
  if (!snap.exists()) {
    await setDoc(verifierRef, {
      ciphertext: makeVerifier(candidateKey),
      createdAt: serverTimestamp(),
    });
    return "new";
  }
  const ct = (snap.data() as { ciphertext: string }).ciphertext;
  return checkVerifier(ct, candidateKey) ? "ok" : "wrong";
}
