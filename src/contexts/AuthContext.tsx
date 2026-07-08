import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { mockAccounts } from "../mocks/auth";
import type { AuthUser, LoginCredentials } from "../types/auth";

const SESSION_STORAGE_KEY = "solabridge:auth-user";

type LoginResult = {
  success: boolean;
  message?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Simula a latência de uma chamada real de API. Quando a integração com o
// backend (Laravel/Sanctum) estiver pronta, essa função dá lugar a uma
// chamada em src/services, mantendo a mesma assinatura de `login`.
function fakeNetworkDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStoredUser(): AuthUser | null {
  const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
    await fakeNetworkDelay();

    const normalizedEmail = credentials.email.trim().toLowerCase();

    const account = mockAccounts.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail
    );

    if (!account || account.password !== credentials.password) {
      return { success: false, message: "E-mail ou senha inválidos." };
    }

    const authUser: AuthUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };

    setUser(authUser);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading: false, login, logout }),
    [user, login, logout]
  );

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