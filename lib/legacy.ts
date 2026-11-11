// Read-only access to data saved by the original React Native app, which used
// Firebase Realtime Database:  Users/{uid}/keys/{sourceName} = { userId, password }
// Both fields are CryptoJS AES ciphertext keyed by the user's master key.
import { getDatabase, get, ref } from "firebase/database";
import { app } from "./firebase";
import { decrypt } from "./crypto";

export type LegacyKeyRecord = { userId?: string; password?: string };
export type LegacyKeys = Record<string, LegacyKeyRecord>;

export async function fetchLegacyKeys(uid: string): Promise<LegacyKeys> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) return {};
  try {
    const snap = await get(ref(getDatabase(app), `Users/${uid}/keys`));
    const val = snap.val();
    return val && typeof val === "object" ? (val as LegacyKeys) : {};
  } catch (err) {
    console.warn("[legacy] could not read old vault", err);
    return {};
  }
}

export function decryptLegacyKeys(raw: LegacyKeys, key: string) {
  return Object.entries(raw).map(([name, rec]) => ({
    name,
    username: rec.userId ? decrypt(rec.userId, key) : "",
    password: rec.password ? decrypt(rec.password, key) : "",
  }));
}

/** True if the key decrypts at least one old entry. */
export function legacyKeyMatches(raw: LegacyKeys, key: string): boolean {
  return decryptLegacyKeys(raw, key).some((e) => e.password.length > 0);
}
