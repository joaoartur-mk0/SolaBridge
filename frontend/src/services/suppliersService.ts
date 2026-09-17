import { apiFetch } from "./apiClient";
import type { Supplier } from "../types/supplier";
import type { CustomerType } from "../types/common";

type BackendPersonType = "PF" | "PJ";

type BackendSupplier = {
  id: number;
  tipo_pessoa: BackendPersonType;
  documento: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  active: boolean;
};

// Laravel paginator (Supplier::query()->paginate(15)) serializado como JSON.
type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ListSuppliersParams = {
  search?: string;
  status?: "active" | "inactive";
};

function toPersonType(tipo: BackendPersonType): CustomerType {
  return tipo === "PJ" ? "Pessoa Jurídica" : "Pessoa Física";
}

function mapBackendSupplier(raw: BackendSupplier): Supplier {
  return {
    id: String(raw.id),
    type: toPersonType(raw.tipo_pessoa),
    name: raw.nome,
    document: raw.documento,
    email: raw.email ?? "",
    phone: raw.telefone ?? "",
    active: raw.active,
  };
}

export async function listSuppliers(
  params: ListSuppliersParams = {}
): Promise<Supplier[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  const queryString = query.toString();
  const path = queryString ? `/suppliers?${queryString}` : "/suppliers";

  const result = await apiFetch<PaginatedResponse<BackendSupplier>>(path);

  return result.data.map(mapBackendSupplier);
}
