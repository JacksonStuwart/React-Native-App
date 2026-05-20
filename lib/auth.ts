import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DEFAULT_CATEGORIES, DEFAULT_CURRENCY } from "./constants";

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await provisionUser(cred.user, displayName);
  return cred.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("vault-master-key");
  }
  await fbSignOut(auth);
}

async function provisionUser(user: User, displayName: string) {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;

  const batch = writeBatch(db);
  batch.set(userRef, {
    displayName,
    email: user.email,
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
    settings: {
      currency: DEFAULT_CURRENCY,
      theme: "system",
      defaultCategoryId: null,
    },
  });

  for (const category of DEFAULT_CATEGORIES) {
    const catRef = doc(db, "users", user.uid, "categories", category.name.toLowerCase());
    batch.set(catRef, {
      ...category,
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong";
  const code = (error as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/invalid-credential": "Wrong email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Wrong password.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] ?? (error as { message?: string }).message ?? "Something went wrong";
}
