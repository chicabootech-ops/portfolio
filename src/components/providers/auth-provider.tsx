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
  refreshSession: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const sessionUser = await fetchSession();
    setUser(sessionUser);
    return sessionUser;
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  // Silently renew access token before it expires (backend default: 15 min).
  useEffect(() => {
    if (!user) {
      return;
    }

    const refreshIntervalMs = 12 * 60 * 1000;

    const intervalId = window.setInterval(() => {
      void refreshSession();
    }, refreshIntervalMs);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, refreshSession]);

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
