import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

// Build-time placeholder so static prerender works without env vars.
// At runtime the real config from .env.local takes over.
const safeConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "placeholder-build-only",
      authDomain: "placeholder.firebaseapp.com",
      projectId: "placeholder",
      storageBucket: "placeholder.appspot.com",
      messagingSenderId: "0",
      appId: "0:0:web:0",
    };

if (typeof window !== "undefined" && !isFirebaseConfigured) {
  console.warn(
    "[firebase] Missing NEXT_PUBLIC_FIREBASE_* env vars. Copy .env.local.example to .env.local and fill in values."
  );
}

export const app: FirebaseApp = getApps()[0] ?? initializeApp(safeConfig);
export const auth: Auth = getAuth(app);

function createDb(): Firestore {
  if (typeof window === "undefined") {
    return initializeFirestore(app, {});
  }
  return initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
}

export const db: Firestore = createDb();
