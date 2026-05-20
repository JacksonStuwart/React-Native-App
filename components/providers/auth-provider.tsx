"use client";

import * as React from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
};

const AuthContext = React.createContext<AuthState>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    loading: true,
  });

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });
    return unsub;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
