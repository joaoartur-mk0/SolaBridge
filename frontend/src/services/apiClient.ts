const DEFAULT_API_BASE_URL = "http://api.localhost/api/v1";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = (
  typeof rawBaseUrl === "string" && rawBaseUrl.length > 0
    ? rawBaseUrl
    : DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const AUTH_TOKEN_STORAGE_KEY = "solabridge:auth-token";

export function getAuthToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

type FieldErrors = Record<string, string[]>;

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: FieldErrors | string[] | null;
};

export class ApiError extends Error {
  status: number;
  errors: FieldErrors | string[] | null;

  constructor(
    message: string,
    status: number,
    errors: FieldErrors | string[] | null = null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  /** Primeira mensagem de erro de campo, quando o backend manda `errors`. */
  get firstFieldError(): string | null {
    if (!this.errors) {
      return null;
    }

    if (Array.isArray(this.errors)) {
      return this.errors[0] ?? null;
    }

    const firstKey = Object.keys(this.errors)[0];
    return firstKey ? (this.errors[firstKey][0] ?? null) : null;
  }
}

// Chamado quando qualquer request autenticada volta com 401 (token ausente,
// expirado ou revogado). O AuthContext registra o próprio `logout` aqui pra
// derrubar a sessão automaticamente em qualquer lugar do app.
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Envia o Bearer token, se houver. Default: true. */
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      0
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload: ApiEnvelope<T> = contentType.includes("application/json")
    ? await response.json()
    : {};

  if (!response.ok) {
    if (auth && response.status === 401) {
      unauthorizedHandler?.();
    }

    throw new ApiError(
      payload.message ?? "Ocorreu um erro inesperado. Tente novamente.",
      response.status,
      payload.errors ?? null
    );
  }

  return (payload.data ?? (payload as unknown as T)) as T;
}