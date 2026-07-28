import { apiFetch } from "./apiClient";
import { getLocalAddress, saveLocalAddress } from "./customerLocalDetails";

import type { Customer } from "../types/customer";
import type { CustomerType } from "../types/common";
import type { Address } from "../types/address";

type BackendCustomerType = "PF" | "PJ";

type BackendCustomer = {
  id: number;
  tipo_pessoa: BackendCustomerType;
  documento: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  codigo_ibge: string | null;
  active: boolean;
};

// Laravel paginator (Customer::query()->paginate(15)) serializado como JSON.
type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// CustomerService::registrarCustomer retorna ["customer" => $customer].
type CreateCustomerResponse = {
  customer: BackendCustomer;
};

export type ListCustomersParams = {
  search?: string;
  status?: "active" | "inactive";
};

export type CreateCustomerInput = {
  type: CustomerType;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  /** Código IBGE do município (7 dígitos) — obrigatório pro back em clientes nacionais. */
  codigoIbge?: string;
  /** Só fica salvo localmente (ver customerLocalDetails.ts). */
  address: Address;
};

const emptyAddress: Address = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

function toBackendType(type: CustomerType): BackendCustomerType {
  return type === "Pessoa Jurídica" ? "PJ" : "PF";
}

function toCustomerType(tipo: BackendCustomerType): CustomerType {
  return tipo === "PJ" ? "Pessoa Jurídica" : "Pessoa Física";
}

function mapBackendCustomer(raw: BackendCustomer): Customer {
  const id = String(raw.id);

  return {
    id,
    type: toCustomerType(raw.tipo_pessoa),
    name: raw.nome,
    document: raw.documento,
    email: raw.email ?? "",
    phone: raw.telefone ?? "",
    address: getLocalAddress(id) ?? emptyAddress,
    active: raw.active,
  };
}

export async function listCustomers(
  params: ListCustomersParams = {}
): Promise<Customer[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  const queryString = query.toString();
  const path = queryString ? `/customers?${queryString}` : "/customers";

  const result = await apiFetch<PaginatedResponse<BackendCustomer>>(path);

  return result.data.map(mapBackendCustomer);
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const result = await apiFetch<CreateCustomerResponse>("/customers", {
    method: "POST",
    body: {
      tipo_pessoa: toBackendType(input.type),
      documento: input.document,
      nome: input.name,
      email: input.email || undefined,
      telefone: input.phone || undefined,
      codigo_ibge: input.codigoIbge || undefined,
    },
  });

  const id = String(result.customer.id);

  const hasAddressContent = Object.values(input.address).some(
    (value) => value.trim() !== ""
  );

  if (hasAddressContent) {
    saveLocalAddress(id, input.address);
  }

  return mapBackendCustomer(result.customer);
}

export async function updateCustomerStatus(
  id: string,
  active: boolean
): Promise<Customer> {
  const result = await apiFetch<BackendCustomer>(`/customers/${id}/status`, {
    method: "PATCH",
    body: { active },
  });

  return mapBackendCustomer(result);
}

export function updateCustomerLocalAddress(id: string, address: Address) {
  saveLocalAddress(id, address);
}