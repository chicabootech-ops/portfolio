"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchSession, logoutSession } from "@/lib/auth/session";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const sessionUser = await fetchSession();
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
