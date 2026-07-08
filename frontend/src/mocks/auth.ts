import type { AuthUser } from "../types/auth";

export type MockAccount = AuthUser & { password: string };

export const mockAccounts: MockAccount[] = [
  {
    id: "USR-001",
    name: "Sérgio Almeida",
    email: "sergio@solabridge.com",
    role: "Administrador",
    password: "solabridge123",
  },
  {
    id: "USR-002",
    name: "João Artur",
    email: "joao@solabridge.com",
    role: "Contador",
    password: "solabridge123",
  },
];