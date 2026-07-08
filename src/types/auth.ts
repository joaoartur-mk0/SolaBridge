export type UserId = string;

export type UserRole = "Administrador" | "Contador" | "Operador";

export type AuthUser = {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginCredentials = {
  email: string;
  password: string;
};