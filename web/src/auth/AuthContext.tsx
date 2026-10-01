import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap, unwrapVoid } from "../api/problem";
import type { Account } from "../api/types";

type AuthState =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "anonymous" }
  | { status: "authenticated"; account: Account };

interface AuthContextValue {
  state: AuthState;
  /** Tries the current session again after a failure to reach the server. */
  retry: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const ME_KEY = ["me"] as const;

/**
 * The signed-in learner. The server owns the session (an HttpOnly cookie); this only asks it who
 * the learner is. An anonymous visitor is a normal answer, not an error.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const queryClient = useQueryClient();

  const me = useQuery({
    queryKey: ME_KEY,
    retry: false,
    staleTime: Infinity,
    queryFn: async (): Promise<Account | null> => {
      try {
        return await unwrap(api.GET("/api/auth/me"));
      } catch (error) {
        if (error instanceof ApiError && error.isUnauthenticated) {
          return null;
        }
        throw error;
      }
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const account = await unwrap(api.POST("/api/auth/login", { body: { email, password } }));
      queryClient.setQueryData(ME_KEY, account);
    },
    [api, queryClient],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await unwrap(api.POST("/api/auth/register", { body: { email, password } }));
      await login(email, password);
    },
    [api, login],
  );

  const logout = useCallback(async () => {
    await unwrapVoid(api.POST("/api/auth/logout"));
    // Nothing from the previous learner may stay in memory. Everything except the session query is
    // dropped; that one is set to anonymous so its observers update and the app shows sign-in.
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== ME_KEY[0] });
    queryClient.setQueryData(ME_KEY, null);
  }, [api, queryClient]);

  const state: AuthState = me.isPending
    ? { status: "loading" }
    : me.isError
      ? { status: "error", error: me.error }
      : me.data
        ? { status: "authenticated", account: me.data }
        : { status: "anonymous" };

  const value = useMemo<AuthContextValue>(
    () => ({ state, retry: () => void me.refetch(), login, register, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.status, me.data, me.error, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return value;
}

/** The signed-in account. Only call this below RequireAuth. */
export function useAccount(): Account {
  const { state } = useAuth();
  if (state.status !== "authenticated") {
    throw new Error("useAccount requires an authenticated learner");
  }
  return state.account;
}
