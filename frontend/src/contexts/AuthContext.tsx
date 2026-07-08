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
  getAuthToken,
  setAuthToken,
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
  token?: string;
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
  // Sessão só é válida se token E usuário existirem juntos.
  const token = getAuthToken();
  const stored = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    clearAuthToken();
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

  // Se qualquer chamada autenticada voltar 401 (token expirado/revogado),
  // derruba a sessão automaticamente em qualquer lugar do app.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResult> => {
      try {
        const response = await apiFetch<LoginApiResponse>("/login", {
          method: "POST",
          body: credentials,
          auth: false,
        });

        if (!response.token || !response.user) {
          return { success: false, message: "Resposta inesperada do servidor." };
        }

        const authUser: AuthUser = {
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          tenantId: response.user.tenant_id,
        };

        setAuthToken(response.token);
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

// eslint-disable-next-line react-refresh/only-export-components -- hook precisa viver junto do Provider/Context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}