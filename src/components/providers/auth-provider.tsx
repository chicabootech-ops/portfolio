"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { fetchCurrentUser } from "@/lib/user/fetch-current-user";
import { logoutSession } from "@/lib/auth/session";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<AuthUser | null>;
  setSessionUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Refresh JWT cookies only — does not hit /me (safe at scale). */
async function refreshAuthTokens(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

const TOKEN_REFRESH_MS = 14 * 60 * 1000;
const VISIBILITY_REFRESH_MS = 10 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const hiddenAtRef = useRef<number | null>(null);

  const { data: me, isLoading, refetch } = useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const user = useMemo(
    () => (me ? mapCurrentUserToAuthUser(me) : null),
    [me]
  );

  const refreshSession = useCallback(async () => {
    const result = await refetch();
    return result.data ? mapCurrentUserToAuthUser(result.data) : null;
  }, [refetch]);

  const setSessionUser = useCallback(
    (sessionUser: AuthUser | null) => {
      if (!sessionUser) {
        queryClient.setQueryData(userQueryKeys.me(), null);
        return;
      }
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await logoutSession();
    queryClient.setQueryData(userQueryKeys.me(), null);
    queryClient.removeQueries({ queryKey: userQueryKeys.all });
  }, [queryClient]);

  // Silent token rotation — no profile refetch, no rate-limit pressure.
  useEffect(() => {
    if (!user) return;

    const intervalId = window.setInterval(() => {
      void refreshAuthTokens();
    }, TOKEN_REFRESH_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        hiddenAtRef.current = Date.now();
        return;
      }

      const hiddenAt = hiddenAtRef.current;
      if (hiddenAt && Date.now() - hiddenAt >= VISIBILITY_REFRESH_MS) {
        void refreshAuthTokens();
      }
      hiddenAtRef.current = null;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshSession,
        setSessionUser,
        logout,
      }}
    >
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
