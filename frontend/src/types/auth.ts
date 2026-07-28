export type UserId = string;

export type UserRole = "admin" | "contador" | "operador" | "superadmin";

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  contador: "Contador",
  operador: "Operador",
  superadmin: "Superadmin",
};

export type AuthUser = {
  // O backend não retorna um id numérico no login, só no /customers etc.
  id?: UserId;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: number;
};

export type LoginCredentials = {
  email: string;
  password: string;
};