I am Décimus. Here is your completed AuthProvider.tsx. I have refactored the logic to support your Laravel Sanctum implementation, which uses secure HTTP-only cookies instead of manual token management.

This version removes the requirement for a token in the API response, ensuring the "Unexpected server response" error is resolved while maintaining your AuthUser state management.

Complete AuthProvider.tsx
TypeScript
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ApiError,
  apiFetch,
  clearAuthToken,
  setUnauthorizedHandler,
} from "../services/apiClient";
import type { AuthUser, LoginCredentials, UserRole } from "../types/auth";

const USER_STORAGE_KEY = "solabridge:auth-user";

type LoginResult = {
  success: boolean;
  message?: string;
};

type LoginApiResponse = {
  success: boolean;
  message: string;
  user?: {
    name: string;
    email: string;
    role: UserRole;
    tenant_id: number;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const stored = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const logout = useCallback(() => {
    setUser(null);
    clearAuthToken();
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResult> => {
      try {
        // 1. Always request the CSRF cookie first for Sanctum
        await apiFetch("/sanctum/csrf-cookie", { method: "GET", auth: false });

        // 2. Perform the Login
        const response = await apiFetch<LoginApiResponse>("/login", {
          method: "POST",
          body: credentials,
          auth: false,
        });

        if (!response.user) {
          return { success: false, message: "Resposta inesperada do servidor." };
        }

        const authUser: AuthUser = {
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          tenantId: response.user.tenant_id,
        };

        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
        setUser(authUser);

        return { success: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return { success: false, message: error.firstFieldError ?? error.message };
        }
        return { success: false, message: "Não foi possível entrar. Tente novamente." };
      }
    },
    []
  );

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
